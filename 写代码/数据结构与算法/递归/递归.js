// master共识 T(n) = a*T(n/x) + O(n ^d) 子问题的规模是一样的
// log(b,a)< d     =>     o(n ^ d)
// log(b,a)> d     =>     o(n ^ log(b,a))
// log(b,a)= d     =>     o(n ^ d * log n)