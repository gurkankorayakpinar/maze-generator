const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 33; // Labirent boyutu (tek sayı olmalı)
const cellSize = 20; // Karelerin büyüklüğü
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let maze, start, goal;

function createMaze() {
    let maze = Array(size).fill().map(() => Array(size).fill(1));

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function carve(x, y) {
        maze[y][x] = 0;
        let directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        shuffle(directions);

        for (const [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            if (ny > 0 && ny < size - 1 && nx > 0 && nx < size - 1 && maze[ny][nx] === 1) {
                maze[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    let startX = 1 + 2 * Math.floor(Math.random() * ((size - 2) / 2));
    let startY = 1 + 2 * Math.floor(Math.random() * ((size - 2) / 2));
    carve(startX, startY);

    return maze;
}

function getRandomEmptyCell() {
    let emptyCells = [];
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            if (maze[y][x] === 0) {
                emptyCells.push({ x, y });
            }
        }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// BFS (Breadth First Search) ile yol bulma
function findPath(start, goal) {
    let visited = Array(size).fill().map(() => Array(size).fill(false));
    let queue = [{ x: start.x, y: start.y, path: [] }];
    visited[start.y][start.x] = true;

    while (queue.length > 0) {
        let { x, y, path } = queue.shift();
        let currentPath = [...path, { x, y }];

        if (x === goal.x && y === goal.y) {
            return currentPath; // Yol bulunduğunda geri dön
        }

        let directions = [
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
        ];

        for (let { dx, dy } of directions) {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < size && ny < size &&
                maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, path: currentPath });
            }
        }
    }
    return []; // Yol bulunamazsa boş array
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tüm kareleri çiz (açık gri arka plan ve ince gri sınırlar)
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "black" : "#D3D3D3"; // Duvarlar siyah, yollar açık gri
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "gray"; // İnce sınırlar için gri
            ctx.lineWidth = 0.5; // Çok ince çizgi
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // Başlangıç (mavi) ve hedef (kırmızı) noktalarını çiz
    ctx.fillStyle = "blue";
    ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = "red";
    ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);

    // Yolu yeşil karelerle çiz ve uzunluğu hesapla
    const path = findPath(start, goal);
    let pathLength = 0;

    if (path.length > 2) { // En az 3 nokta varsa (başlangıç + ara + hedef)
        ctx.fillStyle = "green";
        // İlk noktayı (mavi) ve son noktayı (kırmızı) atla
        for (let i = 1; i < path.length - 1; i++) {
            ctx.fillRect(path[i].x * cellSize, path[i].y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "gray"; // Yeşil kareler için ince sınır
            ctx.lineWidth = 0.5; // Çok ince çizgi
            ctx.strokeRect(path[i].x * cellSize, path[i].y * cellSize, cellSize, cellSize);
        }
        pathLength = path.length - 2; // Başlangıç ve hedef hariç ara kareler
    } else {
        pathLength = 0; // Doğrudan bitişikse, yol uzunluğu 0 olur.
    }

    // Yol uzunluğunu göster.
    document.getElementById("path-length").textContent = pathLength;

    // Labirent boyutunu göster.
    document.getElementById("maze-size").textContent = `${size} x ${size}`;
}

function generateMaze() {
    let attempts = 0;
    const maxAttempts = 10; // Maksimum deneme sayısı (sonsuz döngüyü engellemek için)

    do {
        maze = createMaze();
        start = getRandomEmptyCell();
        do {
            goal = getRandomEmptyCell();
        } while (start.x === goal.x && start.y === goal.y);
        attempts++;
    } while (findPath(start, goal).length === 0 && attempts < maxAttempts);

    if (attempts === maxAttempts) {
        console.warn("Geçerli bir labirent oluşturulamadı. Sonuç rastgele olabilir.");
    }

    drawMaze();
}

// "Sağ tık ile menü açma" özelliği devre dışı
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Her yenilemede, yeni bir labirent oluştur.
generateMaze();