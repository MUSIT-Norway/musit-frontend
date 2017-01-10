# Source folder explanation

* components

    - Generic and reusable components, like formfields and other components.

* fonts

    - Our custom font files, referenced from index.css
    
* layout

    - The layout wrapper and components
    
* models

    - System wide models/classes that describe their data and/or behaviour/display
    
* modules

    - Contains a folder for each module/page in the application. The app module is the main module which everyone inherits from.

* redux

    - (almost) All boiler plate related to redux
   
* rxjs

    - Custom modules written in rxjs that are used in the application.
    - The modules access the redux store from the global object.