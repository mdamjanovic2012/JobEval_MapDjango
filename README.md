## Setup

virtualenv .env
source .env/bin/activate
pip install -r requirements/requirements.txt
./manage.py migrate
./manage.py runserver


## superuser

username: admin
password: admin


## Google Fusion Tables url

https://www.google.com/fusiontables/DataSource?docid=1FsTlGEQDMXmx1eX3808pRAPkvVZ0zttlggsScBDG