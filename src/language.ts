export const LanguageJson = {
  en: {
    musit: {
      conservation: {
        search: 'Conservation search',
        queryPlaceholder: 'Search for conservation event',
        conservation: 'Conservation',
        askForDeleteConfirmation: 'Would you like to delete sub-event?',
        notAbleToCollapse:
          'Not allowed to collapse the sub event in edit mode. Please click on save and cancel button to change the edit mode.',
        errorDownloadingOperation: 'Error in the downloading operation',
        confirmDelete: 'Sub-event has been deleted.',
        objectsConnected: 'Objects connected to conservation',
        numOfObjects: 'Number of objects:',
        subEvents: 'Sub events',
        documents: 'Documents',
        newConservation: 'New conservation',
        createConservation: 'Create conservation',
        choseNewSubEvents: 'Select new sub events to be created',
        createNewSubEvents: 'Create sub event',
        roles: {
          administrator: 'Administrator',
          doneBy: 'Done by',
          participating: 'Participating'
        },
        errorMessages: {
          noRoleForPerson: 'No role chosen for person',
          noUUIDForPerson: 'No person chosen from person list',
          cannotCreateConservationBecauseOfSamples:
            'Cannot create conservation for samples (check selected objects!)',
          notAllowed: 'You do not have the appropriate access rights to see conservation.'
        },
        note: 'Note',
        caseNumber: 'Case number',
        personsConnected: 'Persons associated with the conservation',
        objectsOrSamples: 'Objects/samples',
        events: {
          treatment: {
            treatment: 'Treatment',
            keyword: 'Keyword',
            treatmentType: 'Treatment Type',
            'keywordTreatmentType)': 'Keyword (Treatment Type)',
            materialUsage: 'Material Usage',
            productName: 'Product Name',
            synonyms: 'Synonyms',
            materialUsageDetails: 'Material Usage (Product Name, Synonyms, Description)',
            description: 'Description',
            note: 'Note',
            result: 'Result',
            noteDescriptionResult: 'Note/Description/Result'
          },
          technicalDescription: {
            technicalDescription: 'Technical description',
            note: 'Note'
          },
          storageAndHandling: {
            storageAndHandling: 'Storage and handling',
            note: 'Note',
            lightLevel: 'Light level',
            uvLevel: 'UV level',
            relativeHumidity: 'Relative humidity(%)',
            temperature: 'Temperature(°C)'
          },
          hseRisk: {
            hseRisk: 'HSE-risk',
            note: 'Note'
          },
          conditionAssessment: {
            conditionAssessment: 'Condition assessment',
            note: 'Note',
            conditionCode: 'Condition code',
            chooseConditionAssessment: 'Select condition'
          },
          report: {
            report: 'Report',
            note: 'Note',
            archiveReference: 'Archive reference'
          },
          materialDetermination: {
            materialDetermination: 'Material determination',
            note: 'Note',
            material: 'Material',
            specialMaterial: 'Special material',
            sequence: 'Sequence'
          },
          measurementDetermination: {
            tooltip: {
              largestLengthTooltip: 'Largest length',
              largestWidthTooltip: 'Largest width',
              largestThicknessTooltip: 'Largest thickness',
              largestHeightTooltip: 'Largest height',
              largestMeasurementTooltip: 'Largest measurement',
              quantityTooltip: 'Original number of objects(whole and/or broken',
              quantitySymbolTooltip:
                'Enter any uncertainty in the quantity with >(minimum) or ?',
              fragmentQuantityTooltip:
                'how many fragment the object or objects are presented in'
            },
            measurementDetermination: 'Measurement determination',
            note: 'Note',
            weight: 'Weight (gr)',
            length: 'Length',
            width: 'Width',
            thickness: 'Thickness',
            height: 'Height',
            largestLength: 'Largest length',
            largestWidth: 'Largest width',
            largestThickness: 'Largest thickness',
            largestHeight: 'Largest height',
            diameter: 'Diameter',
            tverrmaal: 'Tverrmaal',
            largestMeasurement: 'Largest measurement',
            measurement: 'Measurement',
            quantity: 'Quantity',
            quantitySymbol: 'Uncertainty',
            fragmentQuantity: 'Quantity of fragment'
          },
          note: {
            noteEvent: 'Note',
            note: 'Note'
          }
        },
        doCollapse: 'Collapse sub evebts',
        doExpand: 'Expand sub events'
      },
      objects: {
        goToParentObject: 'Go to object',
        noData: 'No objects to display',
        objectsView: {
          object: 'Object',
          createNewEvent: 'Create new event',
          selectEvent: 'Select event',
          location: 'Location',
          musNo: 'Museum No.',
          museumNoAsANumber: 'Number range',
          subNo: 'Sub No.',
          findingNo: 'Finding No.',
          termTaxon: 'Taxon',
          termItem: 'Artefact',
          term: 'Artefact/Taxon',
          messageToSelectObjects: 'Which objects are connected to the sub-event?',
          messageToViewObjects: 'Objects connected to the sub-event',
          arkForm: 'Form',
          objectView: 'Object view',
          newAnalysis: 'New analysis',
          newSample: 'New sample',
          gender: 'Gender',
          stage: 'Stage',
          material: 'Material',
          specialMaterial: 'Special material',
          materialElement: 'Material element',
          materialType: 'Material type',
          coordinate: 'Coordinate',
          coordinateDatum: 'Coordinate datum',
          coordinatePrecision: 'Precision',
          utmZoneBand: 'UTM zone/band',
          farmName: 'Farm name',
          farmNo: 'Farm No.',
          propertyUnitNo: 'Property unit No.',
          municipality: 'Municipality',
          stateProvince: 'State/Province',
          country: 'Country',
          place: 'Collecting place',
          findingPlace: 'Find place',
          collectionDate: 'Collecting date',
          collectingNumber: 'Find No.',
          events: {
            events: 'Events',
            doneDate: 'Done date',
            eventType: 'Type of event',
            performedBy: 'Done by',
            keyData: 'Key data',
            caseNumber: 'Case No.'
          },
          samples: {
            samples: 'Sample',
            sampleNumber: 'Sample number',
            date: 'Date',
            sampleType: 'Sample type',
            sampleSubType: 'Sample subtype',
            status: 'Status',
            analysis: 'Analysis',
            storageMedia: 'Storage media'
          },
          eventTypes: {
            AnalysisCollection: 'Analysis',
            Analysis: 'Analysis',
            MoveObject: 'Relocating',
            SampleCreated: 'Sample',
            Conservation: 'Conservation'
          }
        }
      },
      administration: {
        administration: 'Administration',
        titleHeader: 'Title',
        descriptionHeader: 'Description',
        analysisTypes: {
          analysisTypes: 'Analysis types',
          description: 'Analysis types for analysis',
          newAnalysisTypeName: 'New analysis type name',
          addAnalysisType: 'Add analysis type'
        },
        sampleTypes: {
          sampleTypes: 'Sample types',
          description: 'Sample types for sample'
        },
        analysisPlaces: {
          analysisPlaces: 'Analysis places',
          description: 'Analysis places for analysis'
        }
      },
      sample: {
        theseFailed: 'The following samples failed and was not created',
        createdSamples: 'Created %{count} samples',
        addToPickList: 'Add samples to picklist',
        noObjects: 'No objects in picklist',
        sample: 'Sample',
        registerSample: 'Sample',
        derivedFromObject: 'Derived from object',
        derivedFromObjectAndSample: 'Derived from object/sample',
        personsAssociatedWithSampleTaking: 'Persons associated with sampling',
        sampleId: 'SampleID',
        sampleNumber: 'Sample No.',
        externalId: 'External ID',
        externalIdSource: 'External ID source',
        sampleType: 'Sample type',
        chooseType: 'Select type',
        sampleSubType: 'Sample subtype',
        roles: {
          creator: 'Done by',
          responsible: 'Responsible'
        },
        chooseSubType: 'Select subtype',
        description: 'Description of sample',
        status: 'Status',
        chooseStatus: 'Select status',
        volumeOrWeight: 'Sample volume/weight',
        chooseUnit: 'Select unit',
        storageContainer: 'Storage container',
        chooseStorageContainer: 'Select container',
        storageMedium: 'Storage medium',
        chooseStorageMedium: 'Select medium',
        treatment: 'Treatment',
        chooseTreatment: 'Select treatment',
        hasResidualMaterial: 'Has residual material',
        comments: 'Comment',
        updateSample: 'Edit',
        saveSampleError: 'Unable to save sample',
        saveSampleSuccess: 'Sample saved'
      },
      analysis: {
        analysis: 'Analysis',
        search: 'Analysis search',
        queryPlaceholder: 'Search for analysis event',
        saveAnalysisError: 'Unable to save analysis',
        notAllowed:
          'You do not have the appropriate access rights to see analysis or samples.',
        saveAnalysisSuccess: 'Analysis saved',
        filterTheList: 'Filter the list',
        analysisType: 'Type of analysis',
        chooseCategory: 'Select category',
        chooseType: 'Select Type',
        analysisAttributes: {
          method: 'Method',
          extractionType: 'Type of Extraction',
          types: 'Types'
        },
        analysisExtraResultAttributes: {
          ageEstimate: 'Age estimate',
          standardDeviation: 'Standard deviation',
          age: 'Age',
          storageMedium: 'Storage medium',
          concentration: 'Concentration',
          volume: 'Volume',
          measurementId: 'Measurement id',
          measurementType: 'Measurement type',
          size: 'Size',
          precision: 'Precision',
          method: 'Method'
        },
        category: {
          '1': 'Chemical analysis',
          '2': 'Colour analysis',
          '3': 'Dating',
          '4': 'Genetic analysis',
          '5': 'Image analysis',
          '6': 'Macro fossil analysis',
          '7': 'Micro fossil analysis',
          '8': 'Morphological measurements',
          '9': 'Osteology',
          '10': 'Sediment analysis',
          '11': 'Species determination',
          '12': 'Textile and fibre analysis',
          '13': 'Wood anatomy'
        },
        reason: 'Purpose of the analysis',
        chooseReason: 'Select reason',
        status: 'Status',
        chooseStatus: 'Select status',
        statusType: {
          '1': 'In preparation',
          '2': 'Analysis initiated',
          '3': 'Analysis Finished',
          '4': 'Completed without results'
        },
        place: 'Location of the analysis',
        choosePlace: 'Select Analysis Place',
        caseNumber: 'Case Number',
        note: 'Note',
        sample: 'Sampling',
        personTillAnalysis: 'Persons associated with the analysis',
        addPersons: 'Add more people',
        objectOrSample: 'Objects/samples',
        museumNumber: 'Museum No.',
        underNumber: 'U. No.',
        term: 'Artefact/Taxon',
        sampleNumber: 'Sample No.',
        sampleType: 'Sample type',
        addMoreObjectOrSample: 'Add more objects/samples',
        externalSource: 'External source',
        commentsToResult: 'Comment to result',
        restrictions: {
          restrictions: 'Restrictions',
          restrictionsFor: 'Restrictions for',
          reasonForRestriction: 'Cause of restrictions',
          caseNumber: 'Case number',
          addMoreCaseNumbers: 'Add Multiple Issue Numbers',
          endDate: 'End Date',
          findActor: 'Find an actor',
          cancelRestriction: 'Cancel restriction',
          reasonForCancelling: 'Cause for cancelling',
          cancelledBy: 'Cancelled by'
        },
        registeringAnalysis: 'Analysis',
        reasonForCancellation: 'Reason for cancellation',
        editAnalysis: 'Edit analysis',
        createAnalysis: 'Create analysis',
        createSample: 'Create sample',
        roles: {
          administrator: 'Administrator',
          responsible: 'Responsible',
          doneBy: 'Done by',
          completedBy: 'Completed by'
        },
        exchange: {
          pageHeader: 'Import analysis result',
          downloadTemplate: 'Download template',
          description:
            'Upload the filled out template and verify that the values are correct.',
          importButton: 'Import',
          cancelImportButton: 'Cancel',

          header: {
            type: 'Type',
            analysisId: 'Analysis id',
            objectId: 'Object id',

            resultComment: 'Comment',
            resultExternalRef: 'External ref',

            resultAge: 'Age',

            resultAgeEstimate: 'Age estimate',
            resultStandardDeviation: 'Standard deviation',

            resultMeasurementId: 'Measurement Id',
            resultMeasurementType: 'Measurement type',
            resultSizeUnit: 'Size unit',
            resultSizeValue: 'Size value',
            resultPrecision: 'Precision',
            resultMethod: 'Method',

            resultStorageMedium: 'Storage medium',
            resultConcentrationUnit: 'Concentration unit',
            resultConcentrationValue: 'Concentration value',
            resultVolumeUnit: 'Volume unit',
            resultVolumeValue: 'Volume value'
          }
        }
      },
      unknown: 'Unknown',
      language: 'Language',
      template: {
        chooseTemplate: 'Choose template',
        labelTemplates: 'Label templates',
        printTemplate: 'Print template',
        fullPath: 'Complete path',
        pathFromBuilding: 'Path including building',
        pathWithTwoClosest: 'Path – two levels'
      },
      userProfile: {
        loggedIn: 'Logged in as %{name}',
        logout: 'Logout',
        collection: 'Collection',
        collections: {
          '1d8dd4e6-1527-439c-ac86-fc315e0ce852': 'Algae',
          '2e4f2455-1b3b-4a04-80a1-ba92715ff613': 'Archaeology',
          'ba3d4d30-810b-4c07-81b3-37751f2196f0': 'Entomology',
          '88b35138-24b5-4e62-bae4-de80fae7df82': 'Ethnography',
          '7352794d-4973-447b-b84e-2635cafe910a': 'Vascular plants',
          'fcb4c598-8b05-4095-ac00-ce66247be38a': 'Lichens',
          'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4': 'Marine invertebrates',
          'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24': 'Bryophyte',
          '8bbdf9b3-56d1-479a-9509-2ea82842e8f8': 'Numismatic',
          '23ca0166-5f9e-44c2-ab0d-b4cdd704af07': 'Fungi',
          '00000000-0000-0000-0000-000000000000': 'All'
        },
        museum: 'Museum',
        museums: {
          '1': 'AM',
          '2': 'UM',
          '3': 'KHM',
          '4': 'NHM',
          '5': 'VM',
          '6': 'TMU',
          '7': 'KMN',
          '99': 'Test',
          '10000': 'All'
        }
      },
      errorMainMessages: {
        applicationError: 'Application error.',
        applicationWarning: 'Application warning',
        networkError: 'Network error.',
        notFound: 'The resource was not found.',
        notAllowed: 'You do not have the appropriate access rights.',
        notAuthenticated: 'You are not logged in.',
        badRequest: 'Invalid data was rejected by the server.',
        errorCode: 'HTTP error code: %{status}',
        noGroups:
          'You do not have access to MUSITbasen. Please contact your Database Coordinator.',
        saveDisabled: 'Save-button is disabled because of missing data',
        scanner: {
          title: 'Search for node or object',
          search: 'Search',
          noMatchingNodeOrObject:
            'Could not find any matching node or object with this barcode.',
          noMatchingNode: 'Could not find any matching node with this barcode.',
          noMatchingObject: 'Could not find any matching object with this barcode.',
          cannotActOnObject: 'This window can not act on barcodes for objects.',
          cannotActOnNode:
            'This window can not act on barcodes for storage facility nodes.',
          noCurrentLocation: 'Object has no storage facility location.'
        },
        objects: {
          notAllowedToSeeAnalysis: 'No access to analysis or samples for object',
          notAllowedToSeeConservations: 'No access to conservations for object',
          notAllowedToSeeStorageData: 'No access to storage data for this object'
        }
      },
      notificationMessages: {
        deleting: 'Delete',
        saving: 'Save',
        moving: 'Move'
      },
      moveHistory: {
        title: 'Location history for',
        from: 'From',
        to: 'To',
        doneBy: 'Performed by',
        doneDate: 'Performed date'
      },
      reports: {
        reports: 'Reports',
        titleHeader: 'Title',
        descriptionHeader: 'Description',
        securingCollections: {
          title: 'Security assessment of collections',
          description: 'Security assessment indicators reported to KD.',
          header: 'Report - Security assessment of collections',
          totalArea: 'Total area:',
          perimeter: 'Perimeter security:',
          theftProtection: 'Theft protection:',
          fireProtection: 'Fire protection:',
          waterDamage: 'Water damage assessment:',
          routinesAndContingencyPlan: 'Routines and contingency plan:'
        }
      },
      events: {
        noData: 'No controls or observations',
        noDataForObject: 'No events found for this object'
      },
      samples: {
        noSamplesForObject: 'No samples found for object'
      },
      moveModal: {
        move: 'Move',
        moveObject: 'Move object %{name}',
        moveObjects: 'Move objects',
        moveNode: 'Move node %{name}',
        moveNodes: 'Move nodes',
        currentDestination: 'Destination:',
        noData: 'No sub nodes',
        nodeSuggestPlaceholder: 'Search for node',
        messages: {
          nodeMoved: '%{name} was moved to %{destination}.',
          objectMoved: '%{name} was moved to %{destination}.',
          errorNode: 'Moving node %{name} to %{destination} failed.',
          errorObject: 'Moving object %{name} to %{destination} failed.',
          nodesMoved: '%{count} nodes were moved to %{destination}',
          objectsMoved: '%{count} objects were moved to %{destination}',
          errorNodes: 'Moving %{count} nodes to %{destination} failed.',
          errorObjects: 'Moving %{count} objects to %{destination} failed.'
        }
      },
      leftMenu: {
        node: {
          newNode: 'New node',
          numObjects: 'No. of objects:',
          totalObjects: 'Total no. of objects:',
          numSamples: 'No. of samples:',
          totalSamples: 'Total no. of samples:',
          numNodes: 'No. of sub nodes:',
          properties: 'Properties',
          observations: 'Observations',
          controller: 'Controls',
          moveNode: 'Move node',
          delete: 'Delete',
          deleteMessages: {
            askForDeleteConfirmation: 'Would you like to delete %{name}?',
            confirmDelete: '%{name} has been deleted.',
            errorCommon: 'Delete failed.',
            errorNotAllowedHadChild: 'Not allowed to delete a node that is not empty.'
          },
          controlsobservations: 'Contr./Observ.'
        },
        observationControl: {
          newObservation: 'New observation',
          newControl: 'New control',
          selectObservation: 'Observations',
          selectControl: 'Controls'
        }
      },
      grid: {
        button: {
          nodes: 'Nodes',
          objects: 'Objects',
          samples: 'Samples',
          observations: 'Observations',
          controls: 'Controls'
        },
        search: {
          placeHolder: 'Filter the list'
        },
        observation: {
          date: 'Date',
          types: 'Types',
          doneBy: 'Performed by',
          registeredDate: 'Reg. date',
          registeredBy: 'Reg. by',
          header: 'Controls and observations',
          iconTooltip: {
            observation: 'Observation',
            control: 'Control'
          }
        },
        node: {
          nodeName: 'Name',
          nodeType: 'Type',
          nodeTypeItems: {
            StorageUnit: 'Storage unit',
            Room: 'Room',
            Building: 'Building',
            Organisation: 'Organisation',
            Root: 'Root',
            RootLoan: 'Root'
          },
          objectCount: 'No. of obj.',
          totalObjectCount: 'Tot. no. of obj.',
          nodeCount: 'No. of nodes',
          iconTooltip: {
            observationAndControl: 'Observations and controls',
            moveNode: 'Move node',
            addToPickList: 'Add to picklist'
          }
        },
        object: {
          museumsNumber: 'Museum No.',
          uNumber: 'U. No.',
          term: 'Artefact/Taxon',
          iconTooltip: {
            moveObjectHistory: 'Move history',
            moveObject: 'Move object',
            addToPickList: 'Add to picklist',
            addAllToPickList: 'Add all to picklist'
          }
        }
      },
      search: {
        stats:
          'Showing %{from} - %{to} out of %{total} matches. Used %{timeUsed} ms searching.',
        ready: 'Fill in the form and push the search button.',
        noResults: 'No results.'
      },
      objectsearch: {
        title: 'Object search',
        addToPickList: 'Add to picklist',
        addAllToPickList: 'Add all',
        museumNo: {
          label: 'Museum No.',
          placeHolder: ' '
        },
        museumNoAsANumber: {
          label: 'Number range',
          placeHolder: ' '
        },
        subNo: {
          label: 'U. No.',
          placeHolder: ' '
        },
        term: {
          label: 'Artefact/Taxon',
          placeHolder: ' '
        },
        q: {
          label: 'Generic',
          placeHolder: ' '
        },
        location: {
          label: 'Location'
        },
        results: {
          title: 'Your search gave %{count} hits:',
          noHit: 'Your search did not give any hits.'
        }
      },
      texts: {
        search: 'Search',
        pageSizeMessage:
          'To improve the performance, location of objects/samples will not show on the search result.',
        numberRangeMessage: 'Museum number range must be in 12..13 format.',
        clearSearch: 'Clear search',
        cookiesBlockedMessage:
          'Cookies blocked. You must enable cookies in Your browser to use this service.',
        conservationReport: 'Conservation report',
        report: 'Report',
        select: 'Select',
        searchData: 'Search data',
        selected: 'Selected',
        notSelected: 'Not selected',
        selectObjects: 'Select objects',
        doNotHaveSufficientRole: 'Do not have sufficient role to perform the operation',
        error: 'Error message',
        musitBase: 'MUSIT base',
        abuotMusit: 'About MUSIT',
        aboutMusitSolutions: 'About MUSIT solutions',
        freetext: 'Free text',
        makeChoice: 'Please choose...',
        chooseValue: 'Select value',
        datePerformed: 'Performed date',
        dateRegistered: 'Registered date',
        registeredBy: 'Registered by',
        performedBy: 'Performed by',
        ok: 'OK',
        notOk: 'Not OK',
        save: 'Save',
        close: 'Close',
        saveTooltip: 'Save registration',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        back: 'Back',
        addObjects: 'Add objects',
        cancelTooltip: 'Cancel registration',
        magazine: 'Storage facility',
        deleteNode: 'Delete node',
        footerText:
          "The University museums IT-organisation (MUSIT) is a national collaboration between the University of Bergen, the University of Oslo, University of Stavanger, Norwegian University of Science and Technology in Trondheim , and the University of Tromsø -Norway's Arctic University.",
        showConfirm: {
          message: 'Are you sure about this?',
          confirm: 'Confirm',
          cancel: 'Cancel',
          ok: 'Ok'
        },
        uploadFile: 'Upload file',
        browse: 'Browse',
        yes: 'Yes',
        no: 'No',
        change: 'Edit',
        lastUpdateBy: 'Last changed by',
        name: 'Name',
        role: 'Role',
        date: 'Date',
        chooseRole: 'Select role',
        attachment: 'Attachment',
        findActor: 'Find actor',
        count: 'Count',
        selectedObjects: 'Selected Objects'
      },
      viewControl: {
        title: 'View control',
        controlAlcohol: 'Alcohol',
        controlCleaning: 'Cleaning',
        controlGas: 'Gas',
        controlHypoxicAir: 'Hypoxic air',
        controlLightingCondition: 'Lighting condition',
        controlMold: 'Mold',
        controlPest: 'Pest',
        controlRelativeHumidity: 'Relative humidity',
        controlTemperature: 'Temperature'
      },
      newControl: {
        title: 'New control',
        date: 'Performed date',
        doneBy: 'Performed by',
        dateRequired: 'Date of control is required.',
        doneByRequired: 'Name of controller is required.',
        temperature: 'Temperature',
        hypoxicAir: 'Hypoxic air',
        relativeHumidity: 'Relative humidity',
        cleaning: 'Cleaning',
        lightCondition: 'Lighting condition',
        alcohol: 'Alcohol',
        gas: 'Gas',
        mold: 'Mold',
        pest: 'Pest',
        envdata: 'Environmental Conditions',
        controlsRequired: 'At least one control type must be checked OK or Not OK',
        registerObservations: 'Register observations',
        dateValidation: 'Date of control can not be later than present date.',
        saveControlError: 'Unable to save control',
        saveControlSuccess: 'Control saved'
      },
      observation: {
        page: {
          titles: {
            add: 'New observation',
            edit: 'Register observations',
            view: 'Observation'
          },
          registerObservation: 'Register observation',
          registerObservations: 'Register observations',
          date: 'Performed date',
          dateRequired: 'Date of observation is required.',
          doneByRequired: 'Name of observer is required.',
          doneBy: 'Performed by',
          registeredDate: 'Registered date',
          registeredBy: 'Registered by',
          newButtonLabel: 'Add new',
          dateValidation: 'Date of observation can not be later than present date.',
          typeSelect: {
            labelText: 'Choose type'
          },
          messages: {
            saveError: 'Could not save observation',
            saveSuccess: 'Observation saved'
          },
          pest: {
            identificationValueRequired: 'Identification is required.',
            identificationValueIncorrect: 'Max length for identification is 100 char.',
            commentsValueIncorrect: 'Max length for Task/Comment is 250 char.',
            countIncorrect: 'Quantity must be an integer.',
            lifeCycleRequired: 'Stage is required when quantity is specified.',
            labelText: 'Pest',
            identificationLabel: 'Identification',
            identificationTooltip: 'Pest identification',
            identificationPlaceHolder: 'Free text',
            commentsLabel: 'Task/Comment',
            commentsTooltip: 'Task that should be performed',
            commentsPlaceHolder: 'Free text',
            lifeCycleLabel: 'Stage',
            lifeCycleLabelMenu: {
              adult: 'Adult',
              puppe: 'Pupa',
              puppeskin: 'Pupa skin',
              larva: 'Larva',
              egg: 'Egg'
            },
            lifeCyclePlaceholder: 'Please choose...',
            lifeCycleTooltip: 'Pest stage',
            countLabel: 'Quantity',
            countPlaceHolder: 'Integer',
            countTooltip: 'Pest quantity'
          },
          alcohol: {
            statusValueRequired: 'Level is required.',
            volumeValueIncorrect: 'Volume must be a number with max 3 decimals.',
            commentValueIncorrect: 'Max length for Task/Comment is 250 char',
            labelText: 'Alcohol',
            volumeLabel: 'Volume',
            volumePlaceHolder: '%',
            volumeTooltip: 'Measured volume %',
            statusLabel: 'Level',
            statusPlaceHolder: 'Please choose...',
            commentLabel: 'Task/Comment',
            commentPlaceHolder: 'Free text',
            commentTooltip: 'Task that should be performed',
            statusItems: {
              satisfactory: 'Satisfactory',
              someDryed: 'Partially dehydrated/evaporated',
              allmostDryed: 'Almost dehydrated/evaporated',
              dryed: 'Dehydrated'
            }
          },
          temperature: {
            toValueSmallerThanFromValue:
              'Measured value (to) must be bigger than measured value (from).',
            fromValueRequired: 'Measured value (from) is required.',
            fromValueIncorrect:
              'Measured value (from) must be a number with max 3 decimals.',
            toValueIncorrect: 'Measured value (to) must be a number with max 3 decimals.',
            commentsValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Temperature',
            fromValueLabelText: 'Measured value (from)',
            toValueLabelText: 'Measured value (to)',
            fromValuePlaceHolder: '°C',
            toValuePlaceHolder: '°C',
            fromValueTooltip: 'Measured temperature',
            toValueTooltip: 'Measured temperature',
            note: 'Task/Comment',
            noteTooltip: 'Task that should be performed',
            notePlaceHolder: 'Free text'
          },
          hypoxicAir: {
            toValueSmallerThanFromValue:
              'Measured value (to) must be bigger than measured value (from).',
            fromValueRequired: 'Measured value (from) is required.',
            fromValueIncorrect:
              'Measured value (from) must be a number with max 3 decimals.',
            toValueIncorrect: 'Measured value (to) must be a number with max 3 decimals.',
            commentsValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Hypoxic air',
            fromValueLabelText: 'Measured value (from)',
            toValueLabelText: 'Measured value (to)',
            fromValuePlaceHolder: '% O₂',
            toValuePlaceHolder: '% O₂',
            fromValueTooltip: 'Measured hypoxic air',
            toValueTooltip: 'Measured hypoxic air',
            note: 'Task/Comment',
            noteTooltip: 'Task that should be performed',
            notePlaceHolder: 'Free text'
          },
          relativeHumidity: {
            toValueSmallerThanFromValue:
              'Measured value (to) must be bigger than measured value (from).',
            fromValueRequired: 'Measured value (from) is required.',
            fromValueIncorrect:
              'Measured value (from) must be a number with max 3 decimals.',
            toValueIncorrect: 'Measured value (to) must be a number with max 3 decimals.',
            commentsValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Relative humidity',
            fromValueLabelText: 'Measured value (from)',
            toValueLabelText: 'Measured value (to)',
            fromValuePlaceHolder: '%',
            toValuePlaceHolder: '%',
            fromValueTooltip: 'Measured rel. humidity',
            toValueTooltip: 'Measured rel. humidity',
            note: 'Task/Comment',
            noteTooltip: 'Task that should be performed',
            notePlaceHolder: 'Free text'
          },
          mold: {
            leftValueRequired: 'Description of observed mold is required.',
            leftValueIncorrect: 'Max length for Description is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Mold',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed mold',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          cleaning: {
            leftValueRequired: 'Description of observed cleaning is required.',
            leftValueIncorrect: 'Max length for Description is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Cleaning',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed cleaning',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          gas: {
            leftValueRequired: 'Measured value is required.',
            leftValueIncorrect: 'Max length for measured value is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Gas',
            leftLabelText: 'Measured value',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Measured gas',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          lightCondition: {
            leftValueRequired: 'Measured/observed value is required.',
            leftValueIncorrect: 'Max length for measured/observed value is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Lighting condition',
            leftLabelText: 'Measured/observed value',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Measured/observed lighting condition',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          skallsikring: {
            leftValueRequired:
              'Description of observed perimeter security status is required.',
            leftValueIncorrect: 'Max length for description is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Perimeter security',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed perimeter security',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          brannsikring: {
            leftValueRequired:
              'Description of observed fire protection status is required.',
            leftValueIncorrect: 'Max length for description is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Fire protection',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed fire protection',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          vannskaderisiko: {
            leftValueRequired:
              'Description of observed water damage assessment is required.',
            leftValueIncorrect: 'Max length for descriptionis 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Water damage assessment',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed water damage assessment',
            rightLabelPlaceToolTip: 'Task that should be performed'
          },
          tyverisikring: {
            leftValueRequired: 'Description of theft protection status is required.',
            leftValueIncorrect: 'Max length for description is 100 char.',
            rightValueIncorrect: 'Max length for Task/Comment is 250 char.',
            labelText: 'Theft protection',
            leftLabelText: 'Description',
            rightLabelText: 'Task/Comment',
            leftLabelPlaceHolder: 'Free text',
            rightLabelPlaceHolder: 'Free text',
            leftLabelToolTip: 'Observed theft protection',
            rightLabelPlaceToolTip: 'Task that should be performed'
          }
        }
      },
      pickList: {
        tooltip: {
          checkBoxMarkAll: 'Select all',
          moveSelectedNodes: 'Move selected nodes',
          printSelectedNodes: 'Print labels for selected nodes',
          moveSelectedObjects: 'Move selected objects',
          removeSelectedNodesFromList: 'Remove selected nodes from list',
          removeSelectedObjectsFromList: 'Remove selected objects from list',
          selectedNodeCount: 'Selected node(s) count',
          selectedObjectCount: 'Selected object(s) count',
          moveNotAllowed: 'No access to move objects/nodes',
          doNotHaveSufficientRole: 'Do not have sufficient role to perform the operation'
        },
        title: {
          nodes: 'Picklist (nodes)',
          objects: 'Picklist (objects)'
        },
        footer: {
          nodeSelected: 'Node(s) selected.',
          objectSelected: 'Object(s) selected.'
        },
        action: {
          markAll: 'All',
          executeAll: 'Execute (all)'
        }
      },
      storageUnits: {
        title: 'Storage facility',
        header: 'Properties',
        newNode: 'New node',
        lastUpdateBy: 'Last updated by: ',
        lastUpdateDate: 'Last updated: ',
        environmentalData: 'Environmental conditions',
        type: {
          labelText: 'Type',
          required: 'Type is required.',
          organisationAllowed: 'Only organisation type is allowed.',
          buildingAllowed: 'Only building type is allowed.',
          organisationAllowedToMove:
            'Only nodes of type Organisation can be moved to a root node.',
          buildingAllowedToMove:
            'Only nodes of type building can be moved to a node type Organisation.',
          notAllowedToMove: 'A node can not be moved into itself.',
          placeHolder: 'Please choose...',
          tooltip: 'Type of node',
          items: {
            StorageUnit: 'Storage unit',
            Room: 'Room',
            Building: 'Building',
            Organisation: 'Organisation'
          }
        },
        name: {
          labelText: 'Name',
          incorrect: 'Max length for name is 100 char.',
          required: 'Name is required.',
          placeHolder: 'Free text',
          tooltip: 'Node name'
        },
        address: {
          labelText: 'Address',
          incorrect: 'Max length for address is 100 char.',
          placeHolder: 'Street adr.',
          tooltip: 'Node address'
        },
        area: {
          labelText: 'Area',
          incorrect: 'Area (from) must be a number with max 3 decimals.',
          placeHolder: 'from',
          tooltip: 'Node area in m²'
        },
        areaTo: {
          labelText: '',
          incorrect: 'Area (to) must be a number with max 3 decimals.',
          placeHolder: 'to',
          tooltip: 'Node area in m²'
        },
        height: {
          labelText: 'Height',
          incorrect: 'Height (from) must be a number with max 3 decimals.',
          placeHolder: 'from',
          tooltip: 'Node height in m'
        },
        heightTo: {
          labelText: '',
          incorrect: 'Height (to) must be a number with max 3 decimals.',
          placeHolder: 'to',
          tooltip: 'Node height in m'
        },
        securityAssessment: {
          securityAssessment: 'Security assessment',
          perimeter: 'Perimeter security',
          theftProtection: 'Theft protection',
          fireProtection: 'Fire protection',
          waterDamage: 'Water damage assessment',
          routinesAndContingencyPlan: 'Routines and contingency plan'
        },
        environmentalAssessment: {
          environmentalAssessment: 'Environmental assessment',
          relativeHumidity: 'Relative humidity',
          temperature: 'Temperature',
          lightingCondition: 'Lighting condition',
          preventiveConservation: 'Preventive conservation'
        },
        environmentRequirement: {
          temperature: {
            labelText: 'Temperature',
            incorrect: 'Temperature must be a number with max 3 decimals.',
            tooltip: 'Temperature requirement in °C',
            placeHolder: '°C'
          },
          temperatureTolerance: {
            labelText: '',
            incorrect: 'Temperature tolerance must be an integer.',
            tooltip: 'Tolerance',
            placeHolder: '°C'
          },
          relativeHumidity: {
            labelText: 'Rel. humidity',
            incorrect: 'Relative humidity must be a number with max 3 decimals.',
            tooltip: 'Relative humidity requirement in %',
            placeHolder: '%'
          },
          relativeHumidityTolerance: {
            labelText: '',
            incorrect: 'Relative humidity tolerance must be an integer.',
            tooltip: 'Tolerance',
            placeHolder: '%'
          },
          hypoxicAir: {
            labelText: 'Hypoxic air',
            incorrect: 'Hypoxic air must be a number with max 3 decimals.',
            tooltip: 'Hypoxic air requirement in % O₂',
            placeHolder: '% O₂'
          },
          hypoxicAirTolerance: {
            labelText: '',
            incorrect: 'Hypoxic air tolerance must be an integer.',
            tooltip: 'Tolerance',
            placeHolder: '% O₂'
          },
          cleaning: {
            labelText: 'Cleaning',
            incorrect: 'Max length for cleaning is 100 char.',
            placeHolder: 'Free text',
            tooltip: 'Cleaning requirement'
          },
          lightingCondition: {
            labelText: 'Lighting condition',
            incorrect: 'Max length for lighting condition is 100 char.',
            placeHolder: 'Free text',
            tooltip: 'Lighting condition requirement'
          },
          comments: {
            labelText: 'Comment',
            incorrect: 'Max length for comment is 250 char.',
            placeHolder: 'Free text',
            tooltip: 'Comment'
          }
        },
        messages: {
          saveNodeError: 'Could not save the node',
          saveNodeSuccess: 'Node is saved'
        },
        errorMessages: {
          notAllowed: 'You have not access to storage facility module'
        }
      },
      login: 'Login through Dataporten'
    }
  },
  no: {
    musit: {
      conservation: {
        search: 'Konservering søk',
        queryPlaceholder: 'Søk etter konservering hendelser',
        conservation: 'Konservering',
        askForDeleteConfirmation: 'Vil du slette delhendelse?',
        notAbleToCollapse:
          'Ikke tillatt å kollapse underhendelsen i redigeringsmodus. Vennligst klikk på lagre og avbryt knappen for å endre redigeringsmodus.',
        errorDownloadingOperation: 'Feil under nedlastingsoperasjonen',
        confirmDelete: 'Delhendelse er slettet.',
        subEvents: 'Delhendelser',
        objectsConnected: 'Objekter knyttet til hendelsen',
        numOfObjects: 'Antall:',
        documents: 'Vedlegg',
        newConservation: 'Ny konservering',
        createConservation: 'Opprett konservering',
        choseNewSubEvents: 'Velg delhendelser som skal lages',
        createNewSubEvents: 'Opprett delhendelse',
        roles: {
          doneBy: 'Utført av',
          participating: 'Deltatt i'
        },
        errorMessages: {
          noRoleForPerson: 'Ingen rolle valgt for person',
          noUUIDForPerson: 'Ingen person valgt fra personliste',
          cannotCreateConservationBecauseOfSamples:
            'Kan ikke opprette konservering for prøver (sjekk valgte objekter!)',
          notAllowed: 'Du har ikke tilgang til konservering.'
        },
        note: 'Merknad',
        caseNumber: 'Saksnummer',
        personsConnected: 'Personer tilknyttet konservering',
        objectsOrSamples: 'Objekter/prøver',
        events: {
          treatment: {
            treatment: 'Behandling',
            keyword: 'Stikkord',
            treatmentType: 'Behandlingstype',
            'keywordTreatmentType)': 'Stikkord (Behandlingstype)',
            materialUsage: 'Materialbruk',
            productName: 'Produktnavn',
            synonyms: 'Synonymer',
            materialUsageDetails: 'Materialbruk (Produktnavn, Synonymer, Beskrivelse)',
            description: 'Beskrivelse',
            note: 'Merknad',
            result: 'Resultat',
            noteDescriptionResult: 'Merknad/Beskrivelse/Resultat'
          },
          technicalDescription: {
            technicalDescription: 'Teknisk beskrivelse',
            note: 'Merknad'
          },
          storageAndHandling: {
            storageAndHandling: ' Oppbevaring og håndtering',
            note: 'Merknad',
            lightLevel: 'Lux',
            uvLevel: 'UVnivå(μW/lumen)',
            relativeHumidity: 'Relativ fuktighet(%)',
            temperature: 'Temperatur(°C)'
          },
          hseRisk: {
            hseRisk: 'HMS-risiko',
            note: 'Merknad'
          },
          conditionAssessment: {
            conditionAssessment: 'Tilstandsvurdering',
            note: 'Merknad',
            conditionCode: 'Tilstandskode',
            chooseConditionAssessment: 'Velg tilstand'
          },
          report: {
            report: 'Rapport',
            note: 'Merknad',
            archiveReference: 'Arkivreferanse'
          },
          materialDetermination: {
            materialDetermination: 'Materialbestemmelse',
            note: 'Merknad',
            material: 'Material',
            specialMaterial: 'Spesialmaterial',
            sequence: 'Sekvens'
          },
          measurementDetermination: {
            tooltip: {
              largestLengthTooltip: 'Største lengde',
              largestWidthTooltip: 'Største bredde',
              largestThicknessTooltip: 'Største tykkelse',
              largestHeightTooltip: 'Største høyde',
              largestMeasurementTooltip: 'Største mål',
              quantityTooltip: 'Opprinnelig antall objekter(hele og/eller ødelagte',
              quantitySymbolTooltip: 'Angi evt. usikkerhet i antall med >(minst) eller ?',
              fragmentQuantityTooltip:
                'hvor mange fragment gjenstanden eller gjenstandene foreligger i'
            },
            measurementDetermination: 'Målbestemmelse',
            note: 'Merknad',
            weight: 'Vekt (gr)',
            length: 'Lengde',
            width: 'Bredde',
            thickness: 'Tykkelse',
            height: 'Høyde',
            largestLength: 'Største lengde',
            largestWidth: 'Største bredde',
            largestThickness: 'Største tykkelse',
            largestHeight: 'Største høyde',
            diameter: 'Diameter',
            tverrmaal: 'Tverrmål',
            largestMeasurement: 'Største mål',
            measurement: 'Annet mål',
            quantity: 'Antall',
            quantitySymbol: 'Usikkerhet',
            fragmentQuantity: 'Antall fragment'
          },
          note: {
            noteEvent: 'Kommentar',
            note: 'Merknad'
          }
        },
        doCollapse: 'Kollaps delhendelser',
        doExpand: 'Ekspander delhendelser'
      },
      objects: {
        goToParentObject: 'Gå til objektet',
        noData: 'Ingen objekter å vise',
        objectsView: {
          object: 'Objekt',
          createNewEvent: 'Opprett ny hendelse',
          selectEvent: 'Velg hendelse',
          location: 'Plassering',
          musNo: 'Museumsnr.',
          museumNoAsANumber: 'Nummer og Intervall',
          subNo: 'Unr.',
          findingNo: 'Funnr.',
          termTaxon: 'Takson',
          termItem: 'Gjenstand',
          term: 'Gjenstand/Takson',
          messageToSelectObjects: 'Hvilke objekter gjelder denne del hendelsen for?',
          messageToViewObjects: 'Objekter i denne delhendelsen',
          arkForm: 'Form',
          objectView: 'Objektvisning',
          newAnalysis: 'Ny analyse',
          newSample: 'Ny prøve',
          gender: 'Kjønn',
          stage: 'Stadium',
          material: 'Materiale',
          specialMaterial: 'Spesialmateriale',
          materialElement: 'Materialelement',
          materialType: 'Materialtype',
          coordinate: 'Koordinat',
          coordinateDatum: 'Koordinatdatum',
          coordinatePrecision: 'Presisjon',
          utmZoneBand: 'UTM sone/bånd',
          farmName: 'Gårdsnavn',
          farmNo: 'Gårdsnr.',
          propertyUnitNo: 'Bruksnr.',
          municipality: 'Kommune',
          stateProvince: 'Fylke',
          country: 'Land',
          place: 'Innsamlingssted',
          findingPlace: 'Funnsted',
          collectionDate: 'Innsamlingsdato',
          collectingNumber: 'Funnnr.',
          events: {
            events: 'Hendelser',
            doneDate: 'Utført dato',
            eventType: 'Type hendelse',
            performedBy: 'Utført av',
            keyData: 'Nøkkeldata',
            caseNumber: 'Saksnr.'
          },
          samples: {
            samples: 'Prøver',
            sampleNumber: 'Prøvenr.',
            date: 'Dato',
            sampleType: 'Prøvetype',
            sampleSubType: 'Prøveundertype',
            status: 'Status',
            analysis: 'Analyse',
            storageMedia: 'Lagringsmedium'
          },
          eventTypes: {
            AnalysisCollection: 'Analyse',
            Analysis: 'Analyse',
            MoveObject: 'Flytting',
            SampleCreated: 'Prøveuttak',
            Conservation: 'Konservering'
          }
        }
      },
      administration: {
        administration: 'Administrasjon',
        titleHeader: 'Tittel',
        descriptionHeader: 'Beskrivelse',
        analysisTypes: {
          analysisTypes: 'Analysetyper',
          description: 'Analysetyper for analyse',
          newAnalysisTypeName: 'Nytt analysetypenavn',
          addAnalysisType: 'Legg til analysetype'
        },
        sampleTypes: {
          sampleTypes: 'Prøvetyper',
          description: 'Prøvetyper for prøve'
        },
        analysisPlaces: {
          analysisPlaces: 'Analysesteder',
          description: 'Analysesteder for analyse'
        }
      },
      sample: {
        theseFailed: 'Følgende prøver feilet og ble ikke opprettet',
        createdSamples: 'Opprettet %{count} prøver',
        addToPickList: 'Legg prøvene i plukklista',
        noObjects: 'Ingen objekter i plukklista',
        sample: 'Prøve',
        registerSample: 'Prøve',
        derivedFromObject: 'Avledet fra objekt',
        derivedFromObjectAndSample: 'Avledet fra objekt/prøve',
        personsAssociatedWithSampleTaking: 'Personer tilknyttet prøveuttaket',
        sampleId: 'PrøveID',
        sampleNumber: 'Prøvenr.',
        externalId: 'Ekstern ID',
        externalIdSource: 'Kilde for ekstern ID',
        sampleType: 'Prøvetype',
        chooseType: 'Velg type',
        sampleSubType: 'Prøveundertype',
        roles: {
          creator: 'Utført av',
          responsible: 'Ansvarlig'
        },
        chooseSubType: 'Velg undertype',
        description: 'Beskrivelse av prøve',
        status: 'Status',
        chooseStatus: 'Velg status',
        volumeOrWeight: 'Prøvevolum/-vekt',
        chooseUnit: 'Velg enhet',
        storageContainer: 'Lagringskontainer',
        chooseStorageContainer: 'Velg kontainer',
        storageMedium: 'Lagringsmedium',
        chooseStorageMedium: 'Velg medium',
        treatment: 'Behandling',
        chooseTreatment: 'Velg behandling',
        hasResidualMaterial: 'Har restmateriale',
        comments: 'Kommentar',
        updateSample: 'Endre prøve',
        saveSampleError: 'Kunne ikke lagre prøven',
        saveSampleSuccess: 'Prøven ble lagret'
      },
      analysis: {
        analysis: 'Analyse',
        search: 'Analysis søk',
        queryPlaceholder: 'Søk etter analyse hendelser',
        saveAnalysisError: 'Kunne ikke lagre analyse',
        saveAnalysisSuccess: 'Analyse ble lagret',
        notAllowed: 'Du har ikke tilgang til analyser.',
        filterTheList: 'Filtrer listen',
        analysisType: 'Type analyse',
        chooseCategory: 'Velg kategori',
        chooseType: 'Velg type',
        analysisAttributes: {
          method: 'Metode',
          extractionType: 'Type Ekstraksjon',
          types: 'Typer'
        },
        analysisExtraResultAttributes: {
          ageEstimate: 'Estimat Alder',
          standardDeviation: 'Standardavvik',
          age: 'Alder',
          storageMedium: 'Lagringsmedium',
          concentration: 'Konsentrasjon',
          volume: 'Volum',
          measurementId: 'Mål-id',
          measurementType: 'Mål-type',
          size: 'Størrelse',
          precision: 'Presisjon',
          method: 'Metode'
        },
        category: {
          '1': 'Kjemisk analyse',
          '2': 'Fargeanalyse',
          '3': 'Datering',
          '4': 'Genetisk analyse',
          '5': 'Bildeanalyse',
          '6': 'Makrofossilanalyse',
          '7': 'Mikrofossilanalyse',
          '8': 'Morfologiske målinger',
          '9': 'Osteologi',
          '10': 'Sedimentanalyse',
          '11': 'Artsbestemmelse',
          '12': 'Tekstil- og fiberanalyse',
          '13': 'Vedanatomi'
        },
        reason: 'Formål med analysen',
        chooseReason: 'Velg formål',
        status: 'Status på analysen',
        chooseStatus: 'Velg status',
        statusType: {
          '1': 'Under forberedelse',
          '2': 'Analyse påbegynt',
          '3': 'Analyse ferdig',
          '4': 'Avsluttet uten resultat'
        },
        place: 'Analysested',
        choosePlace: 'Velg analysested',
        caseNumber: 'Saksnummer',
        note: 'Merknad',
        sample: 'Prøveuttak',
        personTillAnalysis: 'Personer tilknyttet analysen',
        addPersons: 'Legg til flere personer',
        objectOrSample: 'Objekter/prøver',
        museumNumber: 'Museumsnr.',
        underNumber: 'Unr.',
        term: 'Gjenstand/Takson',
        sampleNumber: 'Prøvenr.',
        sampleType: 'Prøvetype',
        addMoreObjectOrSample: 'Legg til flere objekter/prøver',
        externalSource: 'Ekstern kilde',
        commentsToResult: 'Kommentar til resultat',
        restrictions: {
          restrictions: 'Klausulering',
          restrictionsFor: 'Klausulert for',
          reasonForRestriction: 'Årsak til klausulering',
          caseNumber: 'Saksnummer',
          addMoreCaseNumbers: ' Legg til flere saksnummer',
          endDate: 'Sluttdato',
          findActor: 'Finn aktør',
          cancelRestriction: 'Opphev klausulering',
          reasonForCancelling: 'Årsak til oppheving',
          cancelledBy: 'Opphevet av'
        },
        registeringAnalysis: 'Analyse',
        reasonForCancellation: 'Årsak til oppheving',
        editAnalysis: 'Endre analyse',
        createAnalysis: 'Opprett analyse',
        createSample: 'Opprett prøve',
        registeringSample: 'Registrer prøveuttak',
        roles: {
          administrator: 'Administrert av',
          responsible: 'Ansvarlig',
          doneBy: 'Analysert av',
          completedBy: 'Avsluttet av'
        },
        exchange: {
          pageHeader: 'Importer analyseresultater',
          downloadTemplate: 'Last ned mal',
          description: 'Last opp den utfylte malen og verifiser at de feltene stemmer.',
          importButton: 'Importer',
          cancelImportButton: 'Avbryt',
          header: {
            type: 'Type',
            analysisId: 'Analyse id',
            objectId: 'Objekt id',

            resultComment: 'Kommentar',
            resultExternalRef: 'Ekstern ref',

            resultAge: 'Alder',

            resultAgeEstimate: 'Aldersestimat',
            resultStandardDeviation: 'Standardavvik',

            resultMeasurementId: 'Måle Id',
            resultMeasurementType: 'måletype',
            resultSizeUnit: 'Måleenhet',
            resultSizeValue: 'Måleverdi',
            resultPrecision: 'Presisjon',
            resultMethod: 'Metode',

            resultStorageMedium: 'Lagringsmedium',
            resultConcentrationUnit: 'Konsentrasjonsenhet',
            resultConcentrationValue: 'Konsentrasjonsverdi',
            resultVolumeUnit: 'Volumenhet',
            resultVolumeValue: 'Volumverdi'
          }
        }
      },
      unknown: 'Ukjent',
      language: 'Språk',
      template: {
        chooseTemplate: 'Velg etikettmal',
        labelTemplates: 'Etikettmaler',
        printTemplate: 'Skriv ut',
        fullPath: 'Hel sti',
        pathFromBuilding: 'Sti fra bygg',
        pathWithTwoClosest: 'Sti: to nærmeste nivåer'
      },
      userProfile: {
        loggedIn: 'Logget inn som %{name}',
        logout: 'Logg ut',
        collection: 'Samling',
        collections: {
          '1d8dd4e6-1527-439c-ac86-fc315e0ce852': 'Alger',
          '2e4f2455-1b3b-4a04-80a1-ba92715ff613': 'Arkeologi',
          'ba3d4d30-810b-4c07-81b3-37751f2196f0': 'Entomologi',
          '88b35138-24b5-4e62-bae4-de80fae7df82': 'Etnografi',
          '7352794d-4973-447b-b84e-2635cafe910a': 'Karplanter',
          'fcb4c598-8b05-4095-ac00-ce66247be38a': 'Lav',
          'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4': 'Marine evertebrater',
          'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24': 'Mose',
          '8bbdf9b3-56d1-479a-9509-2ea82842e8f8': 'Numismatikk',
          '23ca0166-5f9e-44c2-ab0d-b4cdd704af07': 'Sopp',
          '00000000-0000-0000-0000-000000000000': 'Alle'
        },
        museum: 'Museum',
        museums: {
          '1': 'AM',
          '2': 'UM',
          '3': 'KHM',
          '4': 'NHM',
          '5': 'VM',
          '6': 'TMU',
          '7': 'KMN',
          '99': 'Test',
          '10000': 'Alle'
        }
      },
      errorMainMessages: {
        applicationError: 'Applikasjonsfeil.',
        applicationWarning: 'Programvarsling',
        networkError: 'Nettverksfeil',
        notFound: 'Ressursen ble ikke funnet.',
        notAllowed: 'Du har ikke tilgang.',
        notAuthenticated: 'Du er ikke logget inn.',
        badRequest: 'Ugyldige data ble sendt til serveren.',
        errorCode: 'HTTP feilkode: %{status}',
        noGroups:
          'Du har ikke tilgang til MUSITbasen. Vennligst kontakt din Databasekoordinator.',
        saveDisabled: 'Lagreknappen er ikke aktiv på grunn av manglende data',
        scanner: {
          title: 'Søk etter node eller objekt',
          search: 'Søk',
          noMatchingNodeOrObject: 'Fant ingen node eller objekt med denne strekkoden.',
          noMatchingNode: 'Fant ingen node med denne strekkoden.',
          noMatchingObject: 'Fant ingen objekt med denne strekkoden.',
          cannotActOnObject: 'Dette skjermbildet håndterer ikke scanning av objekter.',
          cannotActOnNode: 'Dette skjermbildet håndterer ikke scanning av noder.',
          noCurrentLocation: 'Objektet har ingen plassering i magasinet.'
        },
        objects: {
          notAllowedToSeeAnalysis:
            'Du har ikke tilgang til å se analyser eller prøver for dette objektet',
          notAllowedToSeeConservations:
            'Du har ikke tilgang til å se konserveringer for dette objektet',
          notAllowedToSeeStorageData:
            'Du har ikke tilgang til å se magasindata for dette objektet'
        }
      },
      notificationMessages: {
        deleting: 'Sletting',
        saving: 'Lagre',
        moving: 'Flytting'
      },
      moveHistory: {
        title: 'Flyttehistorikk for',
        from: 'Fra',
        to: 'Til',
        doneBy: 'Utført av',
        doneDate: 'Utført dato'
      },
      reports: {
        reports: 'Rapporter',
        titleHeader: 'Tittel',
        descriptionHeader: 'Beskrivelse',
        securingCollections: {
          title: 'Sikring av samlinger',
          description: 'Sikringsindikatorer som rapporteres til KD.',
          header: 'Rapport - Sikring av samlinger',
          totalArea: 'Totalt areal:',
          perimeter: 'Skallsikring:',
          theftProtection: 'Tyverisikring:',
          fireProtection: 'Brannsikring:',
          waterDamage: 'Vannskaderisiko:',
          routinesAndContingencyPlan: 'Rutiner og beredskap:'
        }
      },
      events: {
        noData: 'Ingen kontroller eller observasjoner',
        noDataForObject: 'Ingen hendelser funnet på objektet'
      },
      samples: {
        noSamplesForObject: 'Ingen prøver funnet på objektet'
      },
      moveModal: {
        move: 'Flytt hit',
        moveObject: 'Flytt objekt %{name}',
        moveObjects: 'Flytt objekter',
        moveNode: 'Flytt node %{name}',
        moveNodes: 'Flytt noder',
        currentDestination: 'Destinasjon:',
        noData: 'Ingen undernoder',
        nodeSuggestPlaceholder: 'Søk etter node',
        messages: {
          nodeMoved: '%{name} ble flyttet til %{destination}.',
          objectMoved: '%{name} ble flyttet til %{destination}.',
          errorNode: 'Flytting av %{name} til %{destination} feilet.',
          errorObject: 'Flytting av %{name} til %{destination} feilet.',
          nodesMoved: '%{count} noder ble flyttet til %{destination}',
          objectsMoved: '%{count} objekter ble flyttet til %{destination}',
          errorNodes: 'Flytting av %{count} noder til %{destination} feilet.',
          errorObjects: 'Flytting av %{count} objekter til %{destination} feilet.'
        }
      },
      leftMenu: {
        node: {
          newNode: 'Ny node',
          numObjects: 'Objekter på node:',
          totalObjects: 'Totalt ant. objekter:',
          numSamples: 'Prøver på node:',
          totalSamples: 'Totalt ant. prøver:',
          numNodes: 'Antall undernoder:',
          properties: 'Egenskaper',
          observations: 'Observasjoner',
          controller: 'Kontroller',
          moveNode: 'Flytt node',
          delete: 'Slett',
          deleteMessages: {
            askForDeleteConfirmation: 'Vil du slette %{name}?',
            confirmDelete: '%{name} er slettet.',
            errorCommon: 'Slettingen feilet.',
            errorNotAllowedHadChild: 'Noden er ikke tom, og kan derfor ikke slettes.'
          },
          controlsobservations: 'Kontr./Observ.'
        },
        observationControl: {
          newObservation: 'Ny observasjon',
          newControl: 'Ny kontroll',
          selectObservation: 'Observasjoner',
          selectControl: 'Kontroller'
        }
      },
      grid: {
        button: {
          nodes: 'Noder',
          objects: 'Objekter',
          samples: 'Prøver',
          observations: 'Observasjoner',
          controls: 'Kontroller'
        },
        search: {
          placeHolder: 'Filtrer i listen'
        },
        observation: {
          date: 'Dato',
          types: 'Typer',
          doneBy: 'Utført av',
          registeredDate: 'Reg. dato',
          registeredBy: 'Reg. av',
          header: 'Kontroller og observasjoner',
          iconTooltip: {
            observation: 'Observasjon',
            control: 'Kontroll'
          }
        },
        node: {
          nodeName: 'Navn',
          nodeType: 'Type',
          nodeTypeItems: {
            StorageUnit: 'Lagringsenhet',
            Room: 'Rom',
            Building: 'Bygg',
            Organisation: 'Organisasjon',
            Root: 'Rotnode',
            RootLoan: 'Rotnode'
          },
          objectCount: 'Ant. obj.',
          totalObjectCount: 'Tot. ant. obj.',
          nodeCount: 'Ant. noder',
          iconTooltip: {
            observationAndControl: 'Observasjoner og kontroller',
            moveNode: 'Flytt noden',
            addToPickList: 'Legg til plukklisten'
          }
        },
        object: {
          museumsNumber: 'Museumsnr.',
          uNumber: 'Unr.',
          term: 'Gjenstand/Takson',
          iconTooltip: {
            moveObjectHistory: 'Flyttehistorikk',
            moveObject: 'Flytt objektet',
            addToPickList: 'Legg til plukklisten',
            addAllToPickList: 'Legg til alle i plukklisten'
          }
        }
      },
      search: {
        stats: 'Viser %{from} - %{to} av %{total} treff. Brukte %{timeUsed} ms på søket.',
        ready: 'Fyll inn og trykk på søk knappen',
        noResults: 'Søket ga ingen treff.'
      },
      objectsearch: {
        title: 'Objektsøk',
        addToPickList: 'Legg til plukklisten',
        addAllToPickList: 'Legg til alle i plukklisten',
        museumNo: {
          label: 'Museumsnr.',
          placeHolder: ' '
        },
        museumNoAsANumber: {
          label: 'Nummer og Intervall',
          placeHolder: ' '
        },
        subNo: {
          label: 'Unr.',
          placeHolder: ' '
        },
        term: {
          label: 'Gjenstand/Takson',
          placeHolder: ' '
        },
        q: {
          label: 'Generelt',
          placeHolder: ' '
        },
        location: {
          label: 'Plassering'
        },
        results: {
          title: 'Søket ga %{count} treff:',
          noHit: 'Søket ga ingen treff.'
        }
      },
      texts: {
        search: 'Søk',
        pageSizeMessage:
          'For å forbedre ytelsen vil plasseringen av objekter / prøver ikke vises på søkeresultatet.',
        numberRangeMessage: 'Museumsnummer-intervall må være på formen 12..13',
        clearSearch: 'Blank søk',
        cookiesBlockedMessage:
          'Cookies blokkert. Du må endre innstillingene i nettleseren din til å godta cookies for å bruke denne tjenesten.',
        conservationReport: 'Konservering report',
        report: 'Report',
        select: 'Legg til',
        searchData: 'Søkedata',
        selected: 'Valgt',
        notSelected: 'Ikke valgt',
        selectObjects: 'Velg objekter',
        doNotHaveSufficientRole: 'Har ikke tilstrekkelig rolle for å utføre operasjonen',
        error: 'Feilmelding',
        musitBase: 'MUSITbasen',
        abuotMusit: 'Om MUSIT',
        aboutMusitSolutions: 'Om MUSITløsningen',
        freetext: 'Fritekst',
        makeChoice: 'Vennligst velg...',
        chooseValue: 'Velg verdi',
        datePerformed: 'Utført dato',
        dateRegistered: 'Opprettet dato',
        registeredBy: 'Opprettet av',
        performedBy: 'Utført av',
        ok: 'OK',
        notOk: 'Ikke OK',
        save: 'Lagre',
        close: 'Lukk',
        saveTooltip: 'Lagre',
        cancel: 'Avbryt',
        edit: 'Endre',
        delete: 'Slett',
        back: 'Tilbake',
        addObjects: 'Legg til objekter',
        cancelTooltip: 'Avbryt registreringen',
        magazine: 'Magasin',
        deleteNode: 'Slett node',
        footerText:
          'Universitetsmuseenes IT-organisasjon (MUSIT) er et nasjonalt samarbeidstiltak mellom Universitetet i Bergen, Universitetet i Oslo, Universitetet i Stavanger, Norges teknisk-naturvitenskapelige universitet og UiT Norges arktiske universitet.',
        showConfirm: {
          message: 'Er du sikker på dette?',
          confirm: 'Bekrefte',
          cancel: 'Avbryt',
          ok: 'Ok'
        },
        uploadFile: 'Last opp fil',
        browse: 'Bla gjennom',
        yes: 'Ja',
        no: 'Nei',
        change: 'Endre',
        lastUpdateBy: 'Sist endret av',
        name: 'Navn',
        role: 'Rolle',
        date: 'Dato',
        chooseRole: 'Velg rolle',
        attachment: 'Vedlegg',
        findActor: 'Finn aktør',
        count: 'Antall',
        selectedObjects: 'Antall valgte'
      },
      viewControl: {
        title: 'Vis kontroll',
        controlAlcohol: 'Sprit',
        controlCleaning: 'Renhold',
        controlGas: 'Gass',
        controlHypoxicAir: 'Inertluft',
        controlLightingCondition: 'Lysforhold',
        controlMold: 'Mugg',
        controlPest: 'Skadedyr',
        controlRelativeHumidity: 'Relativ luftfuktighet',
        controlTemperature: 'Temperatur'
      },
      newControl: {
        title: 'Ny kontroll',
        date: 'Utført dato',
        dateRequired: 'Dato for kontrollen er påkrevd.',
        doneBy: 'Utført av',
        doneByRequired: 'Navn på den som utførte kontrollen er påkrevd.',
        temperature: 'Temperatur',
        hypoxicAir: 'Inertluft',
        relativeHumidity: 'Relativ luftfuktighet',
        cleaning: 'Renhold',
        lightCondition: 'Lysforhold',
        alcohol: 'Sprit',
        gas: 'Gass',
        mold: 'Mugg',
        pest: 'Skadedyr',
        envdata: 'Miljødata',
        controlsRequired: 'Minst en kontroll må merkes OK eller Ikke OK',
        registerObservations: 'Registrer observasjoner',
        dateValidation: 'Dato for kontrollen kan ikke være større enn dagens dato.',
        saveControlError: 'Kunne ikke lagre kontrollen',
        saveControlSuccess: 'Kontrollen ble lagret'
      },
      observation: {
        page: {
          titles: {
            add: 'Ny observasjon',
            edit: 'Registrer observasjoner',
            view: 'Observasjon'
          },
          registerObservation: 'Registrer observasjon',
          registerObservations: 'Registrer observasjoner',
          date: 'Utført dato',
          dateRequired: 'Dato for observasjonen er påkrevd.',
          doneByRequired: 'Navn på den som gjorde observasjonen er påkrevd.',
          doneBy: 'Utført av',
          registeredDate: 'Registrert dato',
          registeredBy: 'Registrert av',
          newButtonLabel: 'Legg til ny',
          dateValidation: 'Dato for observasjonen kan ikke være større enn dagens dato.',
          typeSelect: {
            labelText: 'Velg type'
          },
          messages: {
            saveError: 'Kunne ikke lagre observationen',
            saveSuccess: 'Observasjonen ble lagret'
          },
          pest: {
            identificationValueRequired: 'Identifikasjon er påkrevd.',
            identificationValueIncorrect: 'Identifikasjon kan ha maks 100 tegn.',
            commentsValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            countIncorrect: 'Antall må være et heltall.',
            lifeCycleRequired: 'Stadie er påkrevd når antall er oppgitt.',
            labelText: 'Skadedyr',
            identificationLabel: 'Identifikasjon',
            identificationTooltip: 'Identifikasjon av skadedyr',
            identificationPlaceHolder: 'Fritekst',
            commentsLabel: 'Tiltak/Kommentar',
            commentsTooltip: 'Tiltak som bør iverksettes',
            commentsPlaceHolder: 'Fritekst',
            lifeCycleLabel: 'Stadie',
            lifeCycleLabelMenu: {
              adult: 'Adult',
              puppe: 'Puppe',
              puppeskin: 'Puppeskinn',
              larva: 'Larve',
              egg: 'Egg'
            },
            lifeCyclePlaceholder: 'Vennligst velg...',
            lifeCycleTooltip: 'Skadedyrets stadie',
            countLabel: 'Antall',
            countPlaceHolder: 'Heltall',
            countTooltip: 'Antall skadedyr'
          },
          alcohol: {
            statusValueRequired: 'Nivå er påkrevd.',
            volumeValueIncorrect: 'Volum må være et tall med maks 3 desimaler.',
            commentValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Sprit',
            volumeLabel: 'Volum',
            volumePlaceHolder: '%',
            volumeTooltip: 'Målt volum %',
            statusLabel: 'Nivå',
            statusPlaceHolder: 'Vennligst velg...',
            commentLabel: 'Tiltak/Kommentar',
            commentPlaceHolder: 'Fritekst',
            commentTooltip: 'Tiltak som bør iverksettes',
            statusItems: {
              satisfactory: 'Tilfredsstillende',
              someDryed: 'Noe uttørket/avdampett',
              allmostDryed: 'Nesten uttørket/avdampet',
              dryed: 'Uttørket'
            }
          },
          temperature: {
            toValueSmallerThanFromValue:
              'Målt temperatur (til) må være større enn Målt temperatur (fra).',
            fromValueRequired: 'Målt temperatur (fra) er påkrevd.',
            fromValueIncorrect:
              'Målt temperatur (fra) må være et tall med maks 3 desimaler.',
            toValueIncorrect:
              'Målt temperatur (til) må være et tall med maks 3 desimaler.',
            commentsValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Temperatur',
            fromValueLabelText: 'Målt temperatur (fra)',
            toValueLabelText: 'Målt temperatur (til)',
            fromValuePlaceHolder: '°C',
            toValuePlaceHolder: '°C',
            fromValueTooltip: 'Målt temperatur',
            toValueTooltip: 'Målt temperatur',
            note: 'Tiltak/Kommentar',
            noteTooltip: 'Tiltak som bør iverksettes',
            notePlaceHolder: 'Fritekst'
          },
          hypoxicAir: {
            toValueSmallerThanFromValue:
              'Målt inertluft (til) må være større enn Målt inertluft (fra).',
            fromValueRequired: 'Målt inertluft (fra) er påkrevd.',
            fromValueIncorrect:
              'Målt inertluft (fra) må være et tall med maks 3 desimaler.',
            toValueIncorrect:
              'Målt inertluft (til) må være et tall med maks 3 desimaler.',
            commentsValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Inertluft',
            fromValueLabelText: 'Målt inertluft (fra)',
            toValueLabelText: 'Målt inertluft (til)',
            fromValuePlaceHolder: '% O₂',
            toValuePlaceHolder: '% O₂',
            fromValueTooltip: 'Målt inertluft',
            toValueTooltip: 'Målt inertluft',
            note: 'Tiltak/Kommentar',
            noteTooltip: 'Tiltak som bør iverksettes',
            notePlaceHolder: 'Fritekst'
          },
          relativeHumidity: {
            toValueSmallerThanFromValue:
              'Målt rel. luftfuktighet (til) må være større enn Målt rel. luftfuktighet (fra).',
            fromValueRequired: 'Målt rel. luftfuktighet (fra) er påkrevd.',
            fromValueIncorrect:
              'Målt rel. luftfuktighet (fra) må være et tall med maks 3 desimaler.',
            toValueIncorrect:
              'Målt rel. luftfuktighet (til) må være et tall med maks 3 desimaler.',
            commentsValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Relativ luftfuktighet',
            fromValueLabelText: 'Målt rel. luftfuktighet (fra)',
            toValueLabelText: 'Målt rel. luftfuktighet (til)',
            fromValuePlaceHolder: '%',
            toValuePlaceHolder: '%',
            fromValueTooltip: 'Målt rel. luftfuktighet',
            toValueTooltip: 'Målt rel. luftfuktighet',
            note: 'Tiltak/Kommentar',
            noteTooltip: 'Tiltak som bør iverksettes',
            notePlaceHolder: 'Fritekst'
          },
          mold: {
            leftValueRequired: 'Beskrivelse av observert mugg er påkrevd.',
            leftValueIncorrect: 'Beskrivelse av observert mugg kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Mugg',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert mugg',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          cleaning: {
            leftValueRequired: 'Beskrivelse av observert renhold er påkrevd.',
            leftValueIncorrect: 'Beskrivelse av observert renhold kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Renhold',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert renhold',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          gas: {
            leftValueRequired: 'Målt verdi er påkrevd.',
            leftValueIncorrect: 'Målt verdi kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Gass',
            leftLabelText: 'Målt verdi',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Målt gass',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          lightCondition: {
            leftValueRequired: 'Målt/observert verdi er påkrevd',
            leftValueIncorrect: 'Målt/observert verdi kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Lysforhold',
            leftLabelText: 'Målt/observert verdi',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Målt/observert lysforhold',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          skallsikring: {
            leftValueRequired: 'Beskrivelse av skallsikringens tilstand er påkrevd.',
            leftValueIncorrect:
              'Beskrivelse av skallsikringens tilstand kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Skallsikring',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert skallsikring',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          brannsikring: {
            leftValueRequired: 'Beskrivelse av brannsikringens tilstand er påkrevd.',
            leftValueIncorrect:
              'Beskrivelse av brannsikringens tilstand kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Brannsikring',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert brannsikring',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          vannskaderisiko: {
            leftValueRequired: 'Beskrivelse av vannskaderisiko er påkrevd.',
            leftValueIncorrect: 'Beskrivelse av vannskaderisiko kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Vannskaderisiko',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert vannskaderisiko',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          },
          tyverisikring: {
            leftValueRequired: 'Beskrivelse av tyverisikringens tilstand er påkrevd.',
            leftValueIncorrect:
              'Beskrivelse av tyverisikringens tilstand kan ha maks 100 tegn.',
            rightValueIncorrect: 'Tiltak/kommentar kan ha maks 250 tegn.',
            labelText: 'Tyverisikring',
            leftLabelText: 'Beskrivelse',
            rightLabelText: 'Tiltak/Kommentar',
            leftLabelPlaceHolder: 'Fritekst',
            rightLabelPlaceHolder: 'Fritekst',
            leftLabelToolTip: 'Observert tyverisikring',
            rightLabelPlaceToolTip: 'Tiltak som bør iverksettes'
          }
        }
      },
      pickList: {
        tooltip: {
          checkBoxMarkAll: 'Velg alle',
          moveSelectedNodes: 'Flytt valgte noder',
          printSelectedNodes: 'Skriv ut etiketter for valgte noder',
          moveSelectedObjects: 'Flytt valgte objekter',
          removeSelectedNodesFromList: 'Fjern valgte noder fra listen',
          removeSelectedObjectsFromList: 'Fjern valgte objekter fra listen',
          selectedNodeCount: 'Valgt node(r)',
          selectedObjectCount: 'Valgt objekte(r)',
          moveNotAllowed: 'Ikke tilgang til å flytte objekter/noder',
          doNotHaveSufficientRole: 'Har ikke tilstrekkelig rolle for å utføre operasjonen'
        },
        title: {
          nodes: 'Plukkliste (noder)',
          objects: 'Plukkliste (objekter)'
        },
        footer: {
          nodeSelected: 'node(r) valgt.',
          objectSelected: 'objekte(r) valgt.'
        },
        action: {
          markAll: 'Alle',
          executeAll: 'Utfør (alle)'
        }
      },
      storageUnits: {
        title: 'Magasin',
        header: 'Egenskaper',
        newNode: 'Ny node',
        lastUpdateBy: 'Sist endret av: ',
        lastUpdateDate: 'Sist endret dato: ',
        environmentalData: 'Miljødata',
        type: {
          labelText: 'Type',
          required: 'Type er påkrevd.',
          organisationAllowed: 'Bare typen organisasjon er tillatt på dette nivå.',
          buildingAllowed: 'Bare typen bygg er tillatt på dette nivå.',
          organisationAllowedToMove:
            'Kun noder av type Organisasjon kan flyttes til en rotnode.',
          buildingAllowedToMove:
            'Kun noder av type Bygg kan flyttes til en node type Organisasjon.',
          notAllowedToMove: 'En node kan ikke flyttes inn i seg selv.',
          placeHolder: 'Vennligst velg...',
          tooltip: 'Nodens type',
          items: {
            StorageUnit: 'Lagringsenhet',
            Room: 'Rom',
            Building: 'Bygg',
            Organisation: 'Organisasjon'
          }
        },
        name: {
          labelText: 'Navn',
          incorrect: 'Navn kan ha maks 100 tegn.',
          required: 'Navn er påkrevd.',
          placeHolder: 'Fritekst',
          tooltip: 'Navn på noden'
        },
        address: {
          labelText: 'Adresse',
          incorrect: 'Adresse kan ha maks 100 tegn.',
          placeHolder: 'Gateadr.',
          tooltip: 'Nodens adresse'
        },
        area: {
          labelText: 'Areal',
          incorrect: 'Areal (fra) må være et tall med maks 3 desimaler.',
          placeHolder: 'fra',
          tooltip: 'Nodens areal i m²'
        },
        areaTo: {
          labelText: '',
          incorrect: 'Areal (til) må være et tall med maks 3 desimaler.',
          placeHolder: 'til',
          tooltip: 'Nodens areal i m²'
        },
        height: {
          labelText: 'Høyde',
          incorrect: 'Høyde (fra) må være et tall med maks 3 desimaler.',
          placeHolder: 'fra',
          tooltip: 'Nodens høyde i m'
        },
        heightTo: {
          labelText: '',
          incorrect: 'Høyde (til) må være et tall med maks 3 desimaler.',
          placeHolder: 'til',
          tooltip: 'Nodens høyde i m'
        },
        securityAssessment: {
          securityAssessment: 'Sikring',
          perimeter: 'Skallsikring',
          theftProtection: 'Tyverisikring',
          fireProtection: 'Brannsikring',
          waterDamage: 'Vannskaderisiko',
          routinesAndContingencyPlan: 'Rutiner og beredskap'
        },
        environmentalAssessment: {
          environmentalAssessment: 'Bevaring',
          relativeHumidity: 'Relativ luftfuktighet',
          temperature: 'Temperatur',
          lightingCondition: 'Lysforhold',
          preventiveConservation: 'Preventiv konservering'
        },
        environmentRequirement: {
          temperature: {
            labelText: 'Temperatur',
            incorrect: 'Temperatur må være et tall med maks 3 desimaler.',
            tooltip: 'Krav til temperatur i °C',
            placeHolder: '°C'
          },
          temperatureTolerance: {
            labelText: '',
            incorrect: 'Temperaturtoleranse må være et heltall.',
            tooltip: 'Toleranse',
            placeHolder: '°C'
          },
          relativeHumidity: {
            labelText: 'Rel. luftfuktighet',
            incorrect: 'Relativ luftfuktighet må være et tall med maks 3 desimaler.',
            tooltip: 'Krav til relativ luftfuktighet i %',
            placeHolder: '%'
          },
          relativeHumidityTolerance: {
            labelText: '',
            incorrect: 'Relativ luftfuktighettoleranse må være et heltall.',
            tooltip: 'Toleranse',
            placeHolder: '%'
          },
          hypoxicAir: {
            labelText: 'Inertluft',
            incorrect: 'Inertluft må være et tall med maks 3 desimaler.',
            tooltip: 'Krav til inertluft i % O₂',
            placeHolder: '% O₂'
          },
          hypoxicAirTolerance: {
            labelText: '',
            incorrect: 'Inertlufttoleranse må være et heltall.',
            tooltip: 'Toleranse',
            placeHolder: '% O₂'
          },
          cleaning: {
            labelText: 'Renhold',
            incorrect: 'Renhold kan ha maks 100 tegn.',
            placeHolder: 'Fritekst',
            tooltip: 'Krav til renhold'
          },
          lightingCondition: {
            labelText: 'Lysforhold',
            incorrect: 'Lysforhold kan ha maks 100 tegn.',
            placeHolder: 'Fritekst',
            tooltip: 'Krav til lysforhold'
          },
          comments: {
            labelText: 'Kommentar',
            incorrect: 'Kommentar kan ha maks 250 tegn.',
            placeHolder: 'Fritekst',
            tooltip: 'Kommentar'
          }
        },
        messages: {
          saveNodeError: 'Kunne ikke lagre noden',
          saveNodeSuccess: 'Noden er lagret'
        },
        errorMessages: {
          notAllowed: 'Du har ikke tilgang til magasinmodulen'
        }
      },
      login: 'Logg inn via Dataporten'
    }
  }
};
