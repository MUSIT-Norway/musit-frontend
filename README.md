# MUSIT 
Norwegian university museums IT organization (MUSIT); cultural history and natural history database with store integration.

Code status for master branch:
* [![Run Status](https://api.shippable.com/projects/57b2f9eb2a033c0f00ba04e2/badge?branch=master)](https://app.shippable.com/projects/57b2f9eb2a033c0f00ba04e2)
* [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7dcf1d67924b4190bccb2611d0b70478)](https://www.codacy.com/app/musit-project/musit-frontend?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=MUSIT-Norway/musit-frontend&amp;utm_campaign=Badge_Grade)
* [![Coverage Badge](https://api.shippable.com/projects/57b2f9eb2a033c0f00ba04e2/coverageBadge?branch=master)](https://app.shippable.com/projects/57b2f9eb2a033c0f00ba04e2)

Status badges is retrieved directly from the services monitoring the code.

The Norwegian university museums IT organization (MUSIT) is a cooperation agreement between the University of Oslo, University of Bergen, Norwegian University of Science and Technology, University of Tromsø - Norway's Arctic university, and the University of Stavanger. 
The University museums of Norway hold in trust regional and global scientific collections of natural and cultural history. The cooperative aims to ensure the operation, maintenance and development of the university museums' joint collection databases, and to facilitate sharing dissemination of data for research, education, management and the public. 

MUSIT strives for greater integration between its databases and is an open source initiative cooperating with other projects such as DINA (National History museum of Stockholm - Sweden), and Kotka (National History museum of Helsinki - Finland).

## License
All code is protected under the [GPL v2 or later](http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html) and copyright holder is [MUSIT](http://musit.uio.no) as a part of [University of Oslo](http://www.uio.no).

## Requirements

* [Node.js](http://nodejs.org/)

## Installation Steps

### Develop
1. Clone repo
2. Run `npm install`
4. Run `npm run start`
5. Open `http://localhost:8000`

### Deploy
1. Clone repo
2. Run `npm install`
3. Run `npm run build`
4. Copy files under `public` to web server (nginx/apache)


## TODO Magasin

#### Edit, add node er ikke komplett.

Du kan ikke adde med parent node.
Når du legger til en node, henger state ofte med siste state.
Har oppdatert ruter så du kan legge til rot node, legge til undernoder og hente spesifik node.

#### Flytting
Ikke lagt til

#### Sletting
Ikke lagt til

#### MouseOvers/Hjelpetekster
Mangler over alt

#### Valgt node mangler statistikkdata
Mangler metode for å fylle inn statistikk data for en valgt node i nodetreet.

#### Breadcrumb
Mangler en skikkelig breadcrumb
