Barcode service for brother ql 700 with print server, custom setup

-- setup for print server

sudo apt-get update 
sudo apt-get install python-pip
pip install brother_ql --user
pip install --upgrade pip
sudo apt-get install nodejs
sudo apt-get install graphicsmagick
sudo usermod -a -G lp <user>
logout and login(should work: exec su -l $USER)
check printer at: ls -l /dev/usb/lp* 

-create an image with barcode and text description appended
http://localhost:3000/printimage?barcode=764493827364&text=prueba%20de%20texto%20%20descripcion%20larga%20del%20objeto%20a%20vender%20incluido%20tipo%20y%20descripcion

behind the scenes this will run the command 
brother_ql_create --model QL-700 --label-size 62 ./test.png > /dev/usb/lp0

