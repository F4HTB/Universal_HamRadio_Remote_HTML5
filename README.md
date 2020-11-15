# Universal_HamRadio_Remote_HTML5
Universal HamRadio Remote HTML5 interface.<br>
This is an implementation of a python server and HTML5 frontend to provide a web interface to use your TRX for both RX and TX.<br>
You can use basic and some advanced functions of your radio.<br>
You use the speaker and microphone of your computer to communicate.<br>
This project is more oriented for voice (phone) or CW.<br>
<br>
Caution:<br>
It is designed for Raspberry Pi OS (32-bit) Lite (actually "Minimal image based on Debian Buster").<br>
Use only if it is legal in your country.<br>
It is intended for remote use, it is not designed for use on the same computer as an interface even though it will likely work.<br>
Please don't raise an issue for anything outside of the intended design.<br>
<br><br><br>
<b>More info on the wiki page:</b>https://github.com/F4HTB/Universal_HamRadio_Remote_HTML5/wiki
<br><br><br>
News:<br>
-Add panadapter based on the output FI of the radio and a RTLSDR key<br>
-Add authantification mecanisme<br>
<br><br><br>


![alt text](README/UHRR_Pict.png)

This utility is used to set up an amateur radio station remotely via a web browser.

You need:
- a radio station compatible with Hamlib.
- a cat interface.
- a circuit making it possible to adapt the audio levels between the microphone input, the speaker output and the sound card.

Assuming your raspberry pi hostname is set to UHRR, you can access it at https://UHRR.local:8888/
Note the HTTP <b> S </b>.
You can configure all of this by logging into https://UHRR.local:8888/CONFIG
If the original configuration is invalid or missing, this will automatically switch to the configuration page.


![alt text](README/func_princ.png)

![alt text](README/sound_diagram.png)

Special thanks to :

-Mike W9MDB! and all the hamlib team for all their hard work

-All contributors :)
