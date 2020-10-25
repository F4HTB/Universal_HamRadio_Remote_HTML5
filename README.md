# Universal_HamRadio_Remote_HTML5
Universal HamRadio Remote HTML5 interface.<br>
This is an implementation of python server and html5 function to get an webbrowsable interface to use your TRX in RX and TX.<br>
You can use basis and some advanced functions of your radio.
You use your speaker and microphone of your computer to communication.
This project is more oriented for speaking or CW.
<br>
![alt text](README/UHRR_Pict.png)

This utility is used to set up an amateur radio station remotely via a web browser.

You need:
- a radio station compatible with Hamlib.
- a cat interface.
- a circuit making it possible to adapt the audio levels between the microphone input, the speaker output and the sound card.

Assuming your raspberry pi hostname is set to UHRR, you can access it at https://UHRR.local:8888/
Note the HTTP <b> S </b>.
You can configure all of this by logging into https://UHRR.local:8888/CONFIG
If the original configuration is not good, this will automatically switch to the configuration page.

Here are some pictures concerning the implementation:


![alt text](README/func_princ.png?raw=true)

![alt text](README/sound_diagram.png?raw=true)

Requirements:

sudo apt-get install -y git python3 python3-pip3 python3-libhamlib2 python3-numpy python3-tornado python3-serial python3-pyaudio<br>
sudo pip3 install pyalsaaudio<br>

Installation:

cd ~/<br>
git clone https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5.git<br>
cd Universal_HamRadio_Remote_HTML5<br>
sudo cp selfsign.crt /boot/UHRH.crt
sudo cp selfsign.key /boot/UHRH.key
./UHRR<br>

Optional:

sudo apt-get install screen<br>

add in /etc/rc.local the command to run at startup:<br>

sudo nano /etc/rc.local<br>
copy and past: runuser -l pi -c '(cd /home/pi/Universal_HamRadio_Remote_HTML5/ && ./UHRR >> /tmp/uhrr.log) &'<br>
<br>
<br>
![alt text](https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5/blob/master/README/UHRR_conf_Pict.png?raw=true)
<br>
[SERVER]<br>
SERVER port: the server port<br>
<br>
[AUDIO]<br>
AUDIO outputdevice: output from audio soundcard to the mic input of TRX<br>
AUDIO inputdevice: int from audio soundcard from the speaker output of TRX<br>
<br>
[HAMLIB]<br>
HAMLIB com port: com port of the car interface<br>
HAMLIB radio model: hamlib trx model<br>
HAMLIB auto tx poweroff: set if auto off the trx when it's not used<br>
<br>
Possible problem:No //is for get some problemes from the code<br>
<br>
<br>
Other optional to get more function is use Hamlib last version:<br>
<br>
git clone https://github.com/Hamlib/Hamlib<br>
cd Hamlib<br>
./bootstrap<br>
./configure --with-python-binding PYTHON=$(which python3)<br>
make<br>
sudo make install<br>
cd bindings<br>
make<br>
sudo make install<br>
<br>
Special thanks to Mike W9MDB! and all the hamlib team for all the staf<br>
