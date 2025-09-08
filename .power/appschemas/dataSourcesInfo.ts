/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "office365users": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "UpdateMyProfile": {
        "path": "/{connectionId}/codeless/v1.0/me",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyProfile_V2": {
        "path": "/{connectionId}/codeless/v1.0/me",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "UpdateMyPhoto": {
        "path": "/{connectionId}/codeless/v1.0/me/photo/$value",
        "method": "PUT",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          },
          {
            "name": "Content-Type",
            "in": "header",
            "required": true,
            "type": "string",
            "default": "image/jpeg"
          }
        ],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyTrendingDocuments": {
        "path": "/{connectionId}/codeless/beta/me/insights/trending",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "extractSensitivityLabel",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": null
          },
          {
            "name": "fetchSensitivityLabelMetadata",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "RelevantPeople": {
        "path": "/{connectionId}/users/{userId}/relevantpeople",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyProfile": {
        "path": "/{connectionId}/users/me",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserProfile": {
        "path": "/{connectionId}/users/{userId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserPhotoMetadata": {
        "path": "/{connectionId}/users/photo",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserPhoto": {
        "path": "/{connectionId}/users/photo/value",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "Manager": {
        "path": "/{connectionId}/users/{userId}/manager",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "DirectReports": {
        "path": "/{connectionId}/users/{userId}/directReports",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "array",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "SearchUser": {
        "path": "/{connectionId}/users",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "searchTerm",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": 0
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "array",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "SearchUserV2": {
        "path": "/{connectionId}/v2/users",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "searchTerm",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "isSearchTermRequired",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": true
          },
          {
            "name": "skipToken",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "TestConnection": {
        "path": "/{connectionId}/testconnection",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserProfile_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "Manager_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/manager",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "DirectReports_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/directReports",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "UserPhoto_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/photo/$value",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          }
        }
      },
      "TrendingDocuments": {
        "path": "/{connectionId}/codeless/beta/users/{id}/insights/trending",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "extractSensitivityLabel",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": null
          },
          {
            "name": "fetchSensitivityLabelMetadata",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "HttpRequest": {
        "path": "/{connectionId}/codeless/httprequest",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Uri",
            "in": "header",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Method",
            "in": "header",
            "required": true,
            "type": "string",
            "default": "GET"
          },
          {
            "name": "Body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          },
          {
            "name": "ContentType",
            "in": "header",
            "required": false,
            "type": "string",
            "default": "application/json"
          },
          {
            "name": "CustomHeader1",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader2",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader3",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader4",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader5",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      }
    }
  },
  "colaboradores fijos": {
    "tableId": "bea6de47-4399-4208-a1fe-783a0799d00d",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "parkingslots": {
    "tableId": "af4bb332-59f0-4fc0-b714-f37ae1368575",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "pico y placa": {
    "tableId": "55f12b46-e008-4db3-9f68-39403eb1620f",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "reservations": {
    "tableId": "0c842327-497e-460f-8b4b-a89a108640c1",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "settings": {
    "tableId": "aba215d0-3a44-4d6b-8bd5-1672b06b28ed",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "usuarios": {
    "tableId": "d36d18f8-a0b6-4b2a-80ba-c8f619b78b26",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {}
  },
  "teams": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "CreateTeamsMeeting": {
        "path": "/{connectionId}/v1.0/me/calendars/{calendarid}/events",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "calendarid",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetSupportedTimeZones": {
        "path": "/{connectionId}/v1.0/me/outlook/supportedTimeZones",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetAllTeams": {
        "path": "/{connectionId}/beta/me/joinedTeams",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetTeamwork": {
        "path": "/{connectionId}/beta/me/teamwork",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetChannelsForGroup": {
        "path": "/{connectionId}/beta/groups/{groupId}/channels",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "CreateChannel": {
        "path": "/{connectionId}/beta/groups/{groupId}/channels",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetChannel": {
        "path": "/{connectionId}/beta/teams/{groupId}/channels/{channelId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetChats": {
        "path": "/{connectionId}/flowbot/actions/listchats/chattypes/{chatType}/topic/{topic}/expandmembers/false",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "chatType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "all"
          },
          {
            "name": "topic",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "all"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetTags": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "CreateTag": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "AddMemberToTag": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags/{tagId}/members",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetTagMembers": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags/{tagId}/members",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "DeleteTagMember": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags/{tagId}/members/{tagMemberId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagMemberId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "204": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostFeedNotification": {
        "path": "/{connectionId}/flowbot/feednotification/poster/{poster}/notificationType/{notificationType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "notificationType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "AtMentionTag": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags/{tagId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "DeleteTag": {
        "path": "/{connectionId}/beta/teams/{groupId}/tags/{tagId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "tagId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "204": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostMessageToChannelV2": {
        "path": "/{connectionId}/beta/teams/{groupId}/channels/{channelId}/messages",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetMessagesFromChannel": {
        "path": "/{connectionId}/beta/teams/{groupId}/channels/{channelId}/messages",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageDetails": {
        "path": "/{connectionId}/beta/teams/messages/{messageId}/messageType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "messageId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "ListRepliesToMessage": {
        "path": "/{connectionId}/v1.0/teams/{groupId}/channels/{channelId}/messages/{messageId}/replies",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "messageId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": 20
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "ListMembers": {
        "path": "/{connectionId}/v1.0/teams/listmembers/threadType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostMessageToChannelV3": {
        "path": "/{connectionId}/v3/beta/teams/{groupId}/channels/{channelId}/messages",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          }
        }
      },
      "PostReplyToMessage": {
        "path": "/{connectionId}/beta/teams/{groupId}/channels/{channelId}/messages/{messageId}/replies",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "messageId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostReplyToMessageV2": {
        "path": "/{connectionId}/v2/beta/teams/{groupId}/channels/{channelId}/messages/{messageId}/replies",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "messageId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          }
        }
      },
      "OnNewChannelMessage": {
        "path": "/{connectionId}/trigger/beta/teams/{groupId}/channels/{channelId}/messages",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": 50
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "OnNewChannelMessageMentioningMe": {
        "path": "/{connectionId}/trigger/beta/teams/{groupId}/channels/{channelId}/messages_mentioningme",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": 50
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "WebhookAtMentionTrigger": {
        "path": "/{connectionId}/beta/subscriptions/atmentiontrigger/threadType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "requestBody",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "WebhookMessageReactionTrigger": {
        "path": "/{connectionId}/beta/subscriptions/messagereactiontrigger/threadType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "reactionKey",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "frequency",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "runningPolicy",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "requestBody",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "WebhookChatMessageTrigger": {
        "path": "/{connectionId}/beta/subscriptions/chatmessagetrigger",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "ChatMessageSubscriptionRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "WebhookKeywordTrigger": {
        "path": "/{connectionId}/beta/subscriptions/keywordtrigger/threadType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$search",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "requestBody",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "WebhookNewMessageTrigger": {
        "path": "/{connectionId}/beta/subscriptions/newmessagetrigger/threadType/{threadType}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "requestBody",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "DeleteWorkflowsMiddleTierSubscriptions": {
        "path": "/{connectionId}/workflows/graphsubscriptions/{subscriptionIds}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionIds",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "RenewWorkflowsMiddleTierSubscriptions": {
        "path": "/{connectionId}/workflows/graphsubscriptions/{subscriptionIds}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionIds",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "renewEncryptionCert",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "DeleteWebHookSubscription": {
        "path": "/{connectionId}/beta/subscriptions/{subscriptionIds}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionIds",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "RenewWebHookSubscription": {
        "path": "/{connectionId}/beta/subscriptions/{subscriptionIds}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionIds",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "PostMessageToChannel": {
        "path": "/{connectionId}/beta/groups/{groupId}/channels/{channelId}/chatThreads",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "channelId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostUserNotification": {
        "path": "/{connectionId}/flowbot/actions/notification/recipienttypes/user",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "PostNotificationRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "PostChannelNotification": {
        "path": "/{connectionId}/flowbot/actions/notification/recipienttypes/channel",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "PostNotificationRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "PostUserAdaptiveCard": {
        "path": "/{connectionId}/flowbot/actions/adaptivecard/recipienttypes/user",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "PostAdaptiveCardRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "PostChannelAdaptiveCard": {
        "path": "/{connectionId}/flowbot/actions/adaptivecard/recipienttypes/channel",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "PostAdaptiveCardRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetUnifiedActionSchema": {
        "path": "/{connectionId}/flowbot/actions/{actionType}/posters/{poster}/recipienttypes/{recipientType}/schema",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "actionType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetPostToConversationResponseSchema": {
        "path": "/{connectionId}/flowbot/actions/{actionType}/posters/{poster}/recipienttypes/{recipientType}/response/schema",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "actionType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetAdaptiveCardInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/adaptivecard/recipienttypes/{recipientType}/$metadata.json/inputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetNotificationInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/notification/recipienttypes/{recipientType}/$metadata.json/inputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "SubscribeUserMessageWithOptions": {
        "path": "/{connectionId}/flowbot/actions/messagewithoptions/recipienttypes/user/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "UserMessageWithOptionsSubscriptionRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "SubscribeUserFlowContinuation": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/user/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "UserFlowContinuationSubscriptionRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "SubscribeChannelFlowContinuation": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/channel/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "ChannelFlowContinuationSubscriptionRequest",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "UnsubscribeMessageWithOptions": {
        "path": "/{connectionId}/flowbot/actions/messagewithoptions/recipienttypes/{recipientType}/$subscriptions/{subscriptionId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "204": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "UnsubscribeFlowContinuation": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/{recipientType}/$subscriptions/{subscriptionId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "subscriptionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "204": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageWithOptionsInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/messagewithoptions/recipienttypes/{recipientType}/$metadata.json/inputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetFlowContinuationInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/{recipientType}/$metadata.json/inputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageWithOptionsSubscriptionInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/messagewithoptions/recipienttypes/{recipientType}/$metadata.json/subscriptioninputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetFlowContinuationSubscriptionInputMetadata": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/{recipientType}/$metadata.json/subscriptioninputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageWithOptionsSubscriptionOutputMetadata": {
        "path": "/{connectionId}/flowbot/actions/messagewithoptions/recipienttypes/{recipientType}/$metadata.json/subscriptionoutputs",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetFlowContinuationSubscriptionOutputMetadata": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/recipienttypes/{recipientType}/$metadata.json/subscriptionoutputs",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetFlowContinuationSubscriptionWithPosterOutputMetadata": {
        "path": "/{connectionId}/flowbot/actions/flowcontinuation/posters/{poster}/recipienttypes/{recipientType}/$metadata.json/subscriptionoutputs",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "recipientType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetSelectedMessageTriggerOutputsMetadata": {
        "path": "/{connectionId}/flowbot/triggers/selectedmessage/$metadata.json/selectedmessageoutputs",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetComposeMessageTriggerOutputsMetadata": {
        "path": "/{connectionId}/flowbot/triggers/composemessage/$metadata.json/composemessageoutputs",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetCardResponseTriggerOutputsMetadata": {
        "path": "/{connectionId}/flowbot/triggers/cardresponse/$metadata.json/cardresponseoutputs",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetTeam": {
        "path": "/{connectionId}/beta/teams/{teamId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "AtMentionUser": {
        "path": "/{connectionId}/v1.0/users/{userId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "AtMentionBot": {
        "path": "/{connectionId}/custom/teams/bots",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "botMention",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListTimeOffReasons": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/timeOffReasons",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListShifts": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/shifts",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "startTime",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "endTime",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/shifts/{shiftId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "shiftId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "DeleteShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/shifts/{shiftId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "shiftId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "204": {
            "type": "void",
            "format": null
          }
        }
      },
      "ListOpenShifts": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShifts",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "startTime",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "endTime",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "CreateOpenShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShifts",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetOpenShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShifts/{openShiftId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "openShiftId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "UpdateOpenShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShifts/{openShiftId}",
        "method": "PUT",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "openShiftId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "DeleteOpenShift": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShifts/{openShiftId}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "openShiftId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "204": {
            "type": "void",
            "format": null
          }
        }
      },
      "ListSchedulingGroups": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/schedulinggroups",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetSchedulingGroup": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/schedulinggroups/{schedulingGroupId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "schedulingGroupId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListTimeOffRequests": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/timeOffRequests",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "state",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "TimeOffRequestApprove": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/timeOffRequests/{timeOffRequestId}/approve",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "timeOffRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "TimeOffRequestDecline": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/timeOffRequests/{timeOffRequestId}/decline",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "timeOffRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListOfferShiftRequests": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/offerShiftRequests",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "state",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "OfferShiftRequestApprove": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/offerShiftRequests/{offerShiftRequestId}/approve",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "offerShiftRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "OfferShiftRequestDecline": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/offerShiftRequests/{offerShiftRequestId}/decline",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "offerShiftRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListSwapShiftsChangeRequests": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/swapShiftsChangeRequests",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "state",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "SwapShiftsChangeRequestApprove": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/swapShiftsChangeRequests/{swapShiftsChangeRequestId}/approve",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "swapShiftsChangeRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "SwapShiftsChangeRequestDecline": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/swapShiftsChangeRequests/{swapShiftsChangeRequestId}/decline",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "swapShiftsChangeRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListOpenShiftChangeRequests": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShiftChangeRequests",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "state",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "OpenShiftChangeRequestApprove": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShiftChangeRequests/{openShiftChangeRequestId}/approve",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "openShiftChangeRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "OpenShiftChangeRequestDecline": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule/openShiftChangeRequests/{openShiftChangeRequestId}/decline",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "openShiftChangeRequestId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "request",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetSchedule": {
        "path": "/{connectionId}/beta/teams/{teamId}/schedule",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "ForASelectedMessage": {
        "path": "/{connectionId}/hybridtriggers/onselectedmessage",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "inputsAdaptiveCard",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "{}"
          },
          {
            "name": "taskModuleWidth",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "taskModuleHeight",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "ForASelectedMessageV2": {
        "path": "/{connectionId}/hybridtriggers/onselectedmessagev2",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "inputsAdaptiveCard",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "{}"
          },
          {
            "name": "taskModuleWidth",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "taskModuleHeight",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "ComposeAMessage": {
        "path": "/{connectionId}/hybridtriggers/oncomposemessage",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "inputsAdaptiveCard",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "{}"
          },
          {
            "name": "taskModuleWidth",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "taskModuleHeight",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "ComposeAMessageV2": {
        "path": "/{connectionId}/hybridtriggers/composeamessagev2",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "inputsAdaptiveCard",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "{}"
          },
          {
            "name": "taskModuleWidth",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "taskModuleHeight",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "TeamsCardTrigger": {
        "path": "/{connectionId}/hybridtriggers/teamscardtrigger",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "inputsAdaptiveCard",
            "in": "query",
            "required": true,
            "type": "string",
            "default": "{}"
          },
          {
            "name": "CardTypeId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "OnGroupMembershipRemoval": {
        "path": "/{connectionId}/trigger/v1.0/groups/removal",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "members"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array",
            "format": null
          }
        }
      },
      "OnGroupMembershipAdd": {
        "path": "/{connectionId}/trigger/v1.0/groups/delta",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "groupId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "members"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array",
            "format": null
          }
        }
      },
      "CreateChat": {
        "path": "/{connectionId}/beta/chats",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          }
        }
      },
      "CreateATeam": {
        "path": "/{connectionId}/beta/teams",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetTeamsAsyncResult": {
        "path": "/{connectionId}/beta/teamsasyncresult",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "AddMemberToTeam": {
        "path": "/{connectionId}/beta/teams/{teamId}/members",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "204": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostMessageToConversation": {
        "path": "/{connectionId}/beta/teams/conversation/message/poster/{poster}/location/{location}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "ReplyWithMessageToConversation": {
        "path": "/{connectionId}/v1.0/teams/conversation/replyWithMessage/poster/{poster}/location/{location}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostCardToConversation": {
        "path": "/{connectionId}/v1.0/teams/conversation/adaptivecard/poster/{poster}/location/{location}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "PostCardAndWaitForResponse": {
        "path": "/{connectionId}/v1.0/teams/conversation/gatherinput/poster/{poster}/location/{location}/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "ReplyWithCardToConversation": {
        "path": "/{connectionId}/v1.0/teams/conversation/replyWithAdaptivecard/poster/{poster}/location/{location}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UpdateCardInConversation": {
        "path": "/{connectionId}/v1.0/teams/conversation/updateAdaptivecard/poster/{poster}/location/{location}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "location",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "204": {
            "type": "void",
            "format": null
          },
          "201": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetMessageDetailsInputSchema": {
        "path": "/{connectionId}/flowbot/getmessagedetailsinputschema/threadType/{threadType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageDetailsResponseSchema": {
        "path": "/{connectionId}/flowbot/getmessagedetailsresponseschema/threadType/{threadType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "ListMembersInputSchema": {
        "path": "/{connectionId}/flowbot/listmembersinputschema/threadType/{threadType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetWebhookTriggerRequestSchema": {
        "path": "/{connectionId}/flowbot/webhookTrigger/inputSchema/threadType/{threadType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetWebhookTriggerResponseSchema": {
        "path": "/{connectionId}/flowbot/webhookTrigger/triggerType/{triggerType}/responseSchema/threadType/{threadType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "threadType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetMessageLocations": {
        "path": "/{connectionId}/flowbot/messageType/{messageType}/poster/{poster}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "messageType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "GetFeedNotificationInputSchema": {
        "path": "/{connectionId}/flowbot/getfeednotificationinputschema/poster/{poster}/notificationType/{notificationType}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "poster",
            "in": "path",
            "required": true,
            "type": "string",
            "default": "Flow bot"
          },
          {
            "name": "notificationType",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "object",
            "format": null
          }
        }
      },
      "GetVirtualAgentBots": {
        "path": "/{connectionId}/teams/proxy/pva/bots",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "HttpRequest": {
        "path": "/{connectionId}/httprequest",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Uri",
            "in": "header",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Method",
            "in": "header",
            "required": true,
            "type": "string",
            "default": "GET"
          },
          {
            "name": "Body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          },
          {
            "name": "ContentType",
            "in": "header",
            "required": false,
            "type": "string",
            "default": "application/json"
          },
          {
            "name": "CustomHeader1",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader2",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader3",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader4",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader5",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "WebhookResponse": {
        "path": "/whr",
        "method": "POST",
        "parameters": [],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "WebhookLifecycleNotification": {
        "path": "/whlifecycle",
        "method": "POST",
        "parameters": [],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      }
    }
  }
};