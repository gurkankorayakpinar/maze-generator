# Maze Generator

- Bu proje, her turda rastgele koridorların oluşturulduğu ve iki nokta arasındaki rotanın çizildiği bir "labirent oluşturma" uygulamasıdır.

***

- İki noktayı temsil eden mavi ve kırmızı kareler, rastgele yerlerde oluşurlar.

- Mavi ve kırmızı karelerin, kenarlarda ve iç duvarlarda oluşmaları engellenmiştir.

- Labirentlerin oluşturulmasında DFS (Depth-First Search) algoritması kullanılmıştır.

- Labirentlerin "çözülebilir" nitelikte olup olmadığını kontrol etmek için BFS (Breadth First Search) algoritması kullanılmıştır. Eğer BFS ile yol bulunamazsa, yeni bir labirent oluşturulur.

- Algoritmanın yapısı gereği "multiply connected" değil, "simply connected" labirentler oluşur. Bu tip labirentlerde döngü yoktur, tek rota vardır.

- Labirent boyutu değiştirilebilmektedir. Ancak algoritmada hata olmaması için, kenar uzunluklarının "tek sayı" olması gerekmektedir.

- Mouse "sağ tık" ile menü açma özelliği devre dışı bırakılmıştır.