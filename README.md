# Universal_HamRadio_Remote_HTML5
Universal HamRadio Remote HTML5 interface.

![alt text](https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5/blob/master/README/UHRR_Pict.png?raw=true)

This utility is used to set up an amateur radio station remotely via a web browser.

You need:
- a radio station compatible with Hamlib.
- a cat interface.
- a circuit making it possible to adapt the audio levels between the microphone input, the speaker output and the sound card.

You can access it at https://UHRR.local:8888/
Note the HTTP <b> S </b>.
You can configure all of this by logging into https://UHRR.local:8888/CONFIG
If the original configuration is not good, this will automatically switch to the configuration page.

Here are some pictures concerning the implementation:


![alt text](https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5/blob/master/README/func_princ.png?raw=true)

![alt text](https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5/blob/master/README/sound_diagram.png?raw=true)

Requirements:

sudo apt-get install git python3 pip3 python3-libhamlib2 python3-numpy python3-tornado python3-serial<br>
sudo pip3 install pyalsaaudio<br>

Installation:

cd ~/<br>
git clone https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5.git<br>
cd Universal_HamRadio_Remote_HTML5<br>
./UHRR<br>
