#Emigma X
---
coded by Tobias Toland <br>
version 1.058 <br>
encryption engine ♞♞ 

Enigma X is based on the German WWII code machine. Since coding Enigma simulators is popular I wanted to do something unique. This was my attempt to make a more secure Enigma using the basic components of the original machine. It was also my very first JavaScript, and CSS project in 20.

Enigma X will take any basic ASCII message and encrypt it to "Think Ding", a special character set made of 26 Unicode symbols. To do this it translates each ASCII character into two Enigma characters (a letter from A-Z) and then pushes them through a randomly configured plugboard and 26 randomly selected and configured Enigma rotors. Each message also has an added random key encoded within itself that is used to send the message again through a second set of 3 rotors so no two encodings will be the same. Finally the message is encoded to "Think Ding".

My basic security ideas are 1. Remove the reflector so any letter can be encoded to itself 2. Increase the size of the key by a bunch (that's a technical term) 3. Add random variability to every message encoded.

I have attempted to make it as secure as possible, still since I am not really Cryptographer and the machine it is based on is notorious for being broken before the age of computers, it is safe to say this encryption scheme is dubious. With that said, Enigma X is just for fun and education. If anyone has any good ideas for breaking it I'd love to hear about them.

Enigma X is an example of pure JavaScript, HTML, and CSS, with direct DOM manipulation. It does not use JQuery! In fact the only thing not hand built by myself is [SJCL](https://github.com/bitwiseshiftleft/sjcl) which is only used to generate cryptographically secdure random numbers. 

It is published under the MIT licence. The online Enigma simulators by [Louise Dade](), [Mike Koss](http://startpad.googlecode.com/hg/labs/js/enigma/enigma-sim.html) and [Frank Spiess](http://enigmaco.de/enigma/enigma.swf) were all very helpful while coding this. Also thanks to great community at stackoverflow who helped me solve my CSS and JavaScript problems and constantly reminded me that everything is easier with JQuery.


