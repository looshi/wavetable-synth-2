/*
Preset data
The hash value "p" is required, it must match the id.
e.g. {id:42, ..., data:'#p=42&aa=17...'

Don't store arp tempo "at" or arp isOn "ao" or hash values.
The arp settings should stay the same between presets.
*/

export default [
  {id: 1, name: 'Sawl Bass', author: 'Elegant Borzoi', data: 'p=1&ad=53&ao=0&ar=39&as=64&at=41&ca=38&ct=17&fa=5&fd=75&ff=27&fr=41&fre=25&fs=4&g=1&l1a=5&l1d=9&l1r=10&l1s=t&l2a=7&l2d=1&l2r=1&l2s=t&l3a=8&l3d=-1&l3r=12&mv=52&o1a=32&o1al=p&o1d=-6&o1fa=saw_10&o1fb=saw_10&o1o=-1&o2a=36&o2al=p&o2d=6&o2fa=saw_10&o2fb=saw_10&o2o=-2&o3a=5&o3al=m&o3d=0&o3fa=noise&o3fb=noise&o3o=0'},
  {id: 2, name: 'Shark Fin', author: 'Elegant Borzoi', data: 'p=2&aa=0&ad=31&ao=0&ar=28&as=3&at=41&ca=20&ct=100&fa=0&fd=16&ff=70&fr=9&fre=39&fs=7&g=0&l1a=3&l1d=-1&l1r=10&l1s=t&l2a=7&l2d=0&l2r=27&l2s=t&l3a=8&l3d=-1&l3r=12&mv=49&o1a=52&o1al=p&o1d=-5&o1fa=linear_11&o1fb=linear_11&o1o=-1&o2a=12&o2al=p&o2d=2&o2fa=symetric&o2fb=symetric&o2o=2&o3a=5&o3al=p&o3d=-5&o3fa=raw_7&o3fb=organ_6&o3o=2'},
  {id: 3, name: 'Raw Deal', author: 'Elegant Borzoi', data: 'p=3&aa=89&ao=0&ar=28&as=64&at=41&ca=0&ct=34&fa=40&fd=75&ff=23&fr=49&fre=25&fs=68&g=10&l1a=2&l1d=0&l1r=40&l1s=s&l2a=1&l2d=1&l2r=40&l2s=w&l3a=5&l3d=9&l3r=15&l3s=r&mv=52&o1a=85&o1al=d&o1d=-6&o1fa=saw_12&o1fb=saw_9&o1o=-2&o2a=41&o2al=m&o2d=6&o2fa=saw_10&o2fb=snippet&o2o=-2&o3a=0&o3al=x&o3d=0&o3fa=noise&o3fb=organ_12&o3o=-1'},
  {id: 4, name: '555', author: 'Elegant Borzoi', data: 'p=4&aa=0&ar=50&as=67&at=68&ca=39&ct=48&fa=19&fd=50&ff=17&fr=27&fre=45&fs=27&g=8&l1a=26&l1d=6&l1r=54&l1s=t&l2a=21&l2d=9&l2r=52&l2s=s&l3a=9&l3d=9&l3r=12&o1a=63&o1al=p&o1d=0&o1fa=hvoice&o1fb=hvoice&o1o=0&o2a=15&o2al=p&o2fa=hvoice_32&o2fb=hvoice_32&o2o=0&o3a=33&o3al=m&o3d=0&o3fa=noise&o3fb=noise&o3o=0'},
  {id: 5, name: 'Ghost Call', author: 'Elegant Borzoi', data: 'p=5&aa=98&ca=57&ct=39&fa=88&ff=69&fr=13&g=41&l1a=14&l1d=6&l1r=40&l2a=4&l2d=0&l2r=40&l2s=s&o1a=9&o1al=p&o1d=0&o1fa=eorgan&o1fb=eorgan_11&o1o=2&o2a=36&o2al=p&o2fa=fmsynth&o2fb=dbass&o3a=19&o3al=x&o3d=0&o3fa=cheeze_6&o3fb=cheeze_3&o3o=2'},
  {id: 6, name: 'Winterspace', author: 'Elegant Borzoi', data: 'p=6&aa=0&ar=65&as=74&at=68&ca=3&ct=17&fa=0&fd=42&ff=33&fr=32&fre=57&fs=29&g=0&l1a=12&l1d=7&l1r=10&l1s=t&l2a=25&l2d=1&l2r=20&l2s=s&l3a=0&l3d=-1&l3r=12&mv=33&o1al=p&o1d=0&o1fa=saw_8&o1fb=hvoice_37&o1o=-1&o2a=0&o2al=m&o2d=5&o2fa=symetric&o2fb=symetric&o2o=-1&o3a=31&o3al=m&o3d=5&o3fa=noise&o3fb=noise&o3o=-1'},
  {id: 7, name: 'Knight Chills', author: 'Colorputty', data: 'p=7&aa=70&ao=0&ar=100&as=76&at=100&ca=54&ct=86&fa=65&fd=40&ff=12&fr=81&fre=83&fs=75&g=17&l1a=0&l1d=0&l1r=69&l1s=t&l2a=75&l2d=11&l2r=100&l2s=s&l3a=10&l3d=10&l3r=24&l3s=w&mv=30&o1fa=epiano_7&o1fb=organ_6&o1o=-1&o2a=100&o2al=m&o2d=-5&o2fa=ebass_12&o2fb=hvoice_93&o2o=-1&o3a=82&o3al=p&o3d=7&o3fa=linear_11&o3fb=symetric&o3o=-1'}
]
