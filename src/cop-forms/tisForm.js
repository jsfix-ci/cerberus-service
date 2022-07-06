export default {
  "id": "cerberus-airpax-target-information-sheet",
  "version": "1.0.2",
  "name": "cerberus-airpax-target-information-sheet",
  "title": "Target Information Sheet (AirPax)",
  "type": "hub-and-spoke",
  "components": [
    {
      "id": "mode",
      "fieldId": "mode",
      "label": "Mode",
      "type": "autocomplete",
      "readonly": true,
      "item": {
        "value": "id",
        "label": "name"
      },
      "data": {
        "url": "${environmentContext.referenceDataUrl}/v2/entities/targetmode?filter=ca=eq.t&mode=dataOnly&validDateTime=true"
      },
      "description": "Should this be readonly or editable?"
    },
    {
      "id": "issuingHub",
      "fieldId": "issuingHub",
      "label": "Issuing hub",
      "type": "autocomplete",
      "item": {
        "value": "id",
        "label": "name"
      },
      "data": {
        "options": [
          {
            "id": "GAMAH",
            "name": "GA MAH",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "People Hub - NBTC",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Accompanied RoRo Hub",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Airfreight Hub",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Causeway MAH",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Container Hub",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Fast Parcel Hub",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Gateway MAH",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "NMIC",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Vessel Targeting",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "People Hub - PICU",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "People Hub - Development",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "People Hub - RBTT",
            "telephone": "01589 654785 Example"
          },
          {
            "id": "GAMAH",
            "name": "Unaccompanied RoRo Hub",
            "telephone": "01589 654785 Example"
          }
        ]
      }
    },
    {
      "id": "eventPort",
      "fieldId": "eventPort",
      "label": "Port",
      "hint": "The port that the target is scheduled to arrive at",
      "type": "autocomplete",
      "item": {
        "value": "id",
        "label": "name"
      },
      "required": true,
      "data": {
        "url": "${environmentContext.referenceDataUrl}/v2/entities/port?limit=500&skip=0&sort=name.asc&select=id,name&filter=countryid=eq.234&filter=air=eq.true&filter=nonoperational=eq.false&mode=dataOnly&validDateTime=true"
      }
    },
    {
      "id": "movement",
      "fieldId": "movement",
      "type": "container",
      "components": [
        {
          "id": "flightNumber",
          "fieldId": "flightNumber",
          "label": "Flight number",
          "type": "text",
          "pattern": "^[0-9A-Za-z]+$",
          "required": true
        },
        {
          "id": "routeToUK",
          "fieldId": "routeToUK",
          "label": "Route to UK",
          "type": "text",
          "required": true
        },
        {
          "id": "arrival",
          "fieldId": "arrival",
          "type": "container",
          "components": [
            {
              "id": "date",
              "fieldId": "date",
              "label": "Estimated date of arrival",
              "type": "date",
              "required": true
            },
            {
              "id": "time",
              "fieldId": "time",
              "label": "Estimated time of arrival",
              "type": "time",
              "required": true
            }
          ],
          "required": true
        }
      ]
    },
    {
      "id": "person",
      "fieldId": "person",
      "type": "container",
      "components": [
        {
          "id": "name",
          "fieldId": "name",
          "type": "container",
          "components": [
            {
              "id": "first",
              "fieldId": "first",
              "label": "Given name",
              "type": "text",
              "required": true
            },
            {
              "id": "last",
              "fieldId": "last",
              "label": "Family name",
              "type": "text",
              "required": true
            }
          ]
        },
        {
          "id": "dateOfBirth",
          "fieldId": "dateOfBirth",
          "label": "Date of birth",
          "type": "date",
          "required": true
        },
        {
          "id": "nationality",
          "fieldId": "nationality",
          "label": "Nationality",
          "type": "autocomplete",
          "item": {
            "value": "id",
            "label": "nationality"
          },
          "data": {
            "url": "${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true"
          }
        },
        {
          "id": "sex",
          "fieldId": "sex",
          "label": "Sex",
          "type": "autocomplete",
          "item": {
            "value": "id",
            "label": "name"
          },
          "data": {
            "url": "${environmentContext.referenceDataUrl}/v2/entities/sex?mode=dataOnly&validDateTime=true"
          },
          "description": "This is shown as Gender in the UI, which is a different thing to sex."
        },
        {
          "id": "document",
          "fieldId": "document",
          "type": "container",
          "components": [
            {
              "id": "type",
              "fieldId": "type",
              "label": "Travel document type",
              "type": "autocomplete",
              "required": true,
              "item": {
                "value": "id",
                "label": "shortdescription"
              },
              "data": {
                "url": "${environmentContext.referenceDataUrl}/v2/entities/documenttype?sort=shortdescription.asc&mode=dataOnly&validDateTime=true"
              }
            },
            {
              "id": "documentNumber",
              "fieldId": "documentNumber",
              "label": "Travel document number",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./type.code",
                "op": "in",
                "values": [
                  "CR",
                  "ID",
                  "IN",
                  "IR",
                  "P ",
                  "PT",
                  "VA",
                  "VB",
                  "VC",
                  "VD",
                  "VR"
                ]
              },
              "description": "Note that one of the values in the condition is 'P ' with a space afterwards. That's what's in the reference data."
            },
            {
              "id": "documentExpiry",
              "fieldId": "documentExpiry",
              "label": "Travel document expiry",
              "type": "date",
              "required": true,
              "show_when": {
                "field": "./type.code",
                "op": "in",
                "values": [
                  "CR",
                  "ID",
                  "IN",
                  "IR",
                  "P ",
                  "PT",
                  "VA",
                  "VB",
                  "VC",
                  "VD",
                  "VR"
                ]
              },
              "description": "Note that one of the values in the condition is 'P ' with a space afterwards. That's what's in the reference data."
            }
          ]
        },
        {
          "id": "seatNumber",
          "fieldId": "seatNumber",
          "label": "Seat number",
          "type": "text",
          "pattern": "^[0-9]{1,2}[A-Za-z]{1}$",
          "required": true
        },
        {
          "id": "baggage",
          "fieldId": "baggage",
          "type": "container",
          "components": [
            {
              "id": "bagCount",
              "fieldId": "bagCount",
              "label": "Number of bags",
              "type": "text",
              "required": true
            },
            {
              "id": "weight",
              "fieldId": "weight",
              "label": "Baggage weight (kg)",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./bagCount",
                "op": "nin",
                "values": [
                  "",
                  "0",
                  null
                ]
              },
              "description": "Should this only be shown when the number of bags is a positive integer?"
            },
            {
              "id": "tags",
              "fieldId": "tags",
              "label": "Tag details",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./bagCount",
                "op": "nin",
                "values": [
                  "",
                  "0",
                  null
                ]
              },
              "description": "Should this only be shown when the number of bags is a positive integer?"
            }
          ]
        },
        {
          "id": "photograph",
          "fieldId": "photograph",
          "type": "container",
          "components": [
            {
              "id": "photograph",
              "fieldId": "photograph",
              "label": "Photograph",
              "type": "file"
            },
            {
              "id": "date",
              "fieldId": "date",
              "label": "Approximate photograph date",
              "type": "date"
            }
          ]
        }
      ]
    },
    {
      "id": "otherPersons",
      "fieldId": "otherPersons",
      "type": "collection",
      "cya_label": "Other passengers",
      "labels": {
        "item": "Passenger ${index} details",
        "add": "Add another passenger"
      },
      "countOffset": 1,
      "item": [
        {
          "id": "name",
          "fieldId": "name",
          "type": "container",
          "components": [
            {
              "id": "first",
              "fieldId": "first",
              "label": "Given name",
              "type": "text",
              "required": true
            },
            {
              "id": "last",
              "fieldId": "last",
              "label": "Family name",
              "type": "text",
              "required": true
            }
          ]
        },
        {
          "id": "dateOfBirth",
          "fieldId": "dateOfBirth",
          "label": "Date of birth",
          "type": "date",
          "required": true
        },
        {
          "id": "nationality",
          "fieldId": "nationality",
          "label": "Nationality",
          "type": "autocomplete",
          "item": {
            "value": "id",
            "label": "nationality"
          },
          "data": {
            "url": "${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true"
          }
        },
        {
          "id": "sex",
          "fieldId": "sex",
          "label": "Sex",
          "type": "autocomplete",
          "item": {
            "value": "id",
            "label": "name"
          },
          "data": {
            "url": "${environmentContext.referenceDataUrl}/v2/entities/sex?mode=dataOnly&validDateTime=true"
          },
          "description": "This is shown as Gender in the UI, which is a different thing to sex."
        },
        {
          "id": "document",
          "fieldId": "document",
          "type": "container",
          "components": [
            {
              "id": "type",
              "fieldId": "type",
              "label": "Travel document type",
              "type": "autocomplete",
              "required": true,
              "item": {
                "value": "id",
                "label": "shortdescription"
              },
              "data": {
                "url": "${environmentContext.referenceDataUrl}/v2/entities/documenttype?sort=shortdescription.asc&mode=dataOnly&validDateTime=true"
              }
            },
            {
              "id": "documentNumber",
              "fieldId": "documentNumber",
              "label": "Travel document number",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./type.code",
                "op": "in",
                "values": [
                  "CR",
                  "ID",
                  "IN",
                  "IR",
                  "P ",
                  "PT",
                  "VA",
                  "VB",
                  "VC",
                  "VD",
                  "VR"
                ]
              },
              "description": "Note that one of the values in the condition is 'P ' with a space afterwards. That's what's in the reference data."
            },
            {
              "id": "documentExpiry",
              "fieldId": "documentExpiry",
              "label": "Travel document expiry",
              "type": "date",
              "required": true,
              "show_when": {
                "field": "./type.code",
                "op": "in",
                "values": [
                  "CR",
                  "ID",
                  "IN",
                  "IR",
                  "P ",
                  "PT",
                  "VA",
                  "VB",
                  "VC",
                  "VD",
                  "VR"
                ]
              },
              "description": "Note that one of the values in the condition is 'P ' with a space afterwards. That's what's in the reference data."
            }
          ]
        },
        {
          "id": "seatNumber",
          "fieldId": "seatNumber",
          "label": "Seat number",
          "type": "text",
          "pattern": "^[0-9]{1,2}[A-Za-z]{1}$",
          "required": true
        },
        {
          "id": "baggage",
          "fieldId": "baggage",
          "type": "container",
          "components": [
            {
              "id": "bagCount",
              "fieldId": "bagCount",
              "label": "Number of bags",
              "type": "text",
              "required": true
            },
            {
              "id": "weight",
              "fieldId": "weight",
              "label": "Baggage weight (kg)",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./bagCount",
                "op": "nin",
                "values": [
                  "",
                  "0",
                  null
                ]
              },
              "description": "Should this only be shown when the number of bags is a positive integer?"
            },
            {
              "id": "tags",
              "fieldId": "tags",
              "label": "Tag details",
              "type": "text",
              "required": true,
              "show_when": {
                "field": "./bagCount",
                "op": "nin",
                "values": [
                  "",
                  "0",
                  null
                ]
              },
              "description": "Should this only be shown when the number of bags is a positive integer?"
            }
          ]
        },
        {
          "id": "photograph",
          "fieldId": "photograph",
          "type": "container",
          "components": [
            {
              "id": "photograph",
              "fieldId": "photograph",
              "label": "Photograph",
              "type": "file"
            },
            {
              "id": "date",
              "fieldId": "date",
              "label": "Approximate photograph date",
              "type": "date"
            }
          ]
        }
      ]
    },
    {
      "id": "operation",
      "fieldId": "operation",
      "label": "Operation name",
      "type": "text"
    },
    {
      "id": "targetingIndicators",
      "fieldId": "targetingIndicators",
      "label": "Targeting indicators",
      "hint": "This should support multiple selections but presently doesn't",
      "type": "autocomplete",
      "required": true,
      "multi": "true",
      "item": {
        "value": "id",
        "label": "userfacingtext"
      },
      "data": {
        "url": "${environmentContext.referenceDataUrl}/v2/entities/tisfeaturenames?sort=userfacingtext.asc&validto=is.null"
      }
    },
    {
      "id": "category",
      "fieldId": "category",
      "label": "Target category",
      "type": "autocomplete",
      "required": true,
      "item": {
        "value": "id",
        "label": "name"
      },
      "data": {
        "options": [
          {
            "id": "target_A",
            "name": "A"
          },
          {
            "id": "target_B",
            "name": "B"
          },
          {
            "id": "target_C",
            "name": "C"
          },
          {
            "id": "target_U",
            "name": "U"
          },
          {
            "id": "target_S",
            "name": "SABR"
          }
        ]
      }
    },
    {
      "id": "whySelected",
      "fieldId": "whySelected",
      "label": "Why was this target selected?",
      "type": "textarea",
      "description": "Is this something that should be selected? Same as 'Comments on reason for selection'?"
    },
    {
      "id": "additionalInfo",
      "fieldId": "additionalInfo",
      "label": "Any additional information?",
      "type": "textarea"
    },
    {
      "id": "nominalChecks",
      "fieldId": "nominalChecks",
      "label": "Checks completed on nominals",
      "type": "collection",
      "labels": {
        "item": "Nominal ${index} details",
        "add": "Add another nominal"
      },
      "item": [
        {
          "id": "nominalType",
          "fieldId": "nominalType",
          "label": "Nominal type",
          "type": "autocomplete",
          "required": true,
          "item": {
            "value": "value",
            "label": "label"
          },
          "data": {
            "options": [
              {
                "label": "Account",
                "value": "account"
              },
              {
                "label": "Aircraft",
                "value": "aircraft"
              },
              {
                "label": "Air Waybill",
                "value": "airWaybill"
              },
              {
                "label": "Bank Account",
                "value": "bank"
              },
              {
                "label": "Carriage",
                "value": "carriage"
              },
              {
                "label": "Container",
                "value": "container"
              },
              {
                "label": "Flight",
                "value": "flight"
              },
              {
                "label": "Identity Document",
                "value": "identity"
              },
              {
                "label": "Organisation",
                "value": "organisation"
              },
              {
                "label": "Person",
                "value": "person"
              },
              {
                "label": "Postal Address",
                "value": "postal"
              },
              {
                "label": "Telephone",
                "value": "telephone"
              },
              {
                "label": "Trailer",
                "value": "trailer"
              },
              {
                "label": "Vehicle",
                "value": "vehicle"
              },
              {
                "label": "Vessel",
                "value": "vessel"
              }
            ]
          }
        },
        {
          "id": "systemsCheck",
          "fieldId": "systemsCheck",
          "label": "System checks completed",
          "hint": "List all the systems you have checked this nominal against",
          "type": "autocomplete",
          "required": true,
          "multi": "true",
          "item": {
            "value": "id",
            "label": "name"
          },
          "data": {
            "url": "${environmentContext.referenceDataUrl}/v2/entities/partnersystems?mode=dataOnly&validDateTime=true"
          }
        },
        {
          "id": "comments",
          "fieldId": "comments",
          "label": "Comments",
          "hint": "Provide as much useful information as possible. This target will be sent to a frontline team for interdiction.",
          "type": "textarea"
        }
      ]
    },
    {
      "id": "warnings",
      "fieldId": "warnings",
      "type": "container",
      "components": [
        {
          "id": "identified",
          "fieldId": "identified",
          "label": "Have any warnings been identified?",
          "hint": "Use this to notify the target recipient of any warnings or markers, for example the person has a history of violence or has previously ran the controls",
          "type": "radios",
          "data": {
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          },
          "required": true
        },
        {
          "id": "type",
          "fieldId": "type",
          "label": "Warning type(s)",
          "type": "checkboxes",
          "item": {
            "value": "id",
            "label": "name"
          },
          "data": {
            "options": [
              {
                "id": "VIOLENCE",
                "name": "Violence"
              },
              {
                "id": "FIREARMS",
                "name": "Firearms"
              },
              {
                "id": "WEAPONS",
                "name": "Weapons"
              },
              {
                "id": "CONTAGION",
                "name": "Contagion"
              },
              {
                "id": "SELF_HARM",
                "name": "Self Harm"
              },
              {
                "id": "OTHER",
                "name": "Other"
              }
            ]
          },
          "show_when": {
            "field": "./identified",
            "op": "=",
            "value": "yes"
          },
          "required": true,
          "description": "Multi-select autocomplete?"
        },
        {
          "id": "details",
          "fieldId": "details",
          "label": "Details of the warnings",
          "hint": "Please only enter the parameters of the search conducted and not the warning marker itself",
          "type": "textarea",
          "required": true,
          "show_when": {
            "field": "./identified",
            "op": "=",
            "value": "yes"
          },
          "description": "Required?"
        },
        {
          "id": "targetActions",
          "fieldId": "targetActions",
          "type": "container",
          "components": [
            {
              "id": "last",
              "fieldId": "last",
              "label": "Targeter actions / Remarks",
              "type": "text"
            }
          ]
        }
      ],
      "required": true
    },
    {
      "id": "teamToReceiveTheTarget",
      "fieldId": "teamToReceiveTheTarget",
      "label": "Select the team that should receive the target",
      "type": "autocomplete",
      "item": {
        "value": "id",
        "label": "displayname"
      },
      "required": true,
      "data": {
        "url": "${environmentContext.referenceDataUrl}/v2/entities/groups?limit=100&skip=0&sort=displayname.asc&filter=grouptypeid=eq.6&mode=dataOnly&validDateTime=true"
      }
    }
  ],
  "pages": [
    {
      "id": "info",
      "name": "info",
      "title": "Target information",
      "components": [
        {
          "use": "issuingHub"
        },
        {
          "use": "eventPort"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "info",
        "aria_suffix": "target information"
      }
    },
    {
      "id": "movement",
      "name": "movement",
      "title": "Movement details",
      "components": [
        {
          "use": "movement"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "movement",
        "aria_suffix": "movement details"
      }
    },
    {
      "id": "passenger",
      "name": "passenger",
      "title": "Passenger 1 details",
      "components": [
        {
          "use": "person"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "passenger",
        "aria_suffix": "passenger 1 details"
      }
    },
    {
      "id": "other-passengers",
      "name": "other-passengers",
      "title": "Other passenger details",
      "components": [
        {
          "use": "otherPersons"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "other-passengers",
        "aria_suffix": "other passenger details"
      }
    },
    {
      "id": "selection",
      "name": "selection",
      "title": "Selection details",
      "components": [
        {
          "use": "operation"
        },
        {
          "use": "targetingIndicators"
        },
        {
          "use": "category"
        },
        {
          "use": "whySelected"
        },
        {
          "use": "additionalInfo"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "selection",
        "aria_suffix": "selection details"
      }
    },
    {
      "id": "nominalChecks",
      "name": "nominalChecks",
      "title": "Checks completed on nominals",
      "components": [
        {
          "use": "nominalChecks",
          "label": ""
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "nominalChecks",
        "aria_suffix": "checks completed on nominals"
      }
    },
    {
      "id": "warnings",
      "name": "warnings",
      "title": "Warnings",
      "components": [
        {
          "use": "warnings"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "warnings",
        "aria_suffix": "warnings"
      }
    },
    {
      "id": "recipient-details",
      "name": "recipient-details",
      "title": "Recipient Details",
      "components": [
        {
          "use": "teamToReceiveTheTarget"
        }
      ],
      "actions": [
        {
          "type": "next",
          "validate": true,
          "label": "Continue"
        }
      ],
      "cya_link": {
        "page": "recipient-details",
        "aria_suffix": "recipient details"
      }
    }
  ],
  "hub": {
    "format": "CYA"
  },
  "cya": {
    "actions": [
      {
        "type": "submit",
        "validate": true,
        "label": "Accept and send"
      }
    ]
  }
};
