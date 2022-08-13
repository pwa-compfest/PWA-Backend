export default {
  "/auth/signup": {
    "post": {
      "tags": ["Auth"],
      "summary": "Sign Up New User",
      "description": "Sign Up New User",
      "operationId": "signUp",
      "requestBody": {
        "description": "Input Sign Up Data",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string",
                  "example": "user@mail.com",
                  "required": true,
                },
                "password": {
                  "type": "string",
                  "min": 8,
                  "example": "12345678",
                  "required": true,
                },
                "confirmPassword": {
                  "type": "string",
                  "min": 8,
                  "example": "12345678",
                  "required": true,
                },
                "role": {
                  "type": "string",
                  "example": "ADMIN | STUDENT | INSTRUCTOR",
                  "required": true,
                },
                "name": {
                  "type": "string",
                  "example": "Huhu",
                  "required": true,
                },
                "phoneNumber": {
                  "type": "string",
                  "example": "089987319823",
                  "required": "For 'INSTRUCTOR' Role Only",
                },
                "photo": {
                  "type": "string",
                  "example": "https://i.pinimg.com/564x/3e/18/83/3e1883ca724cd0a55de94fae32343fdd.jpg",
                  "required": false,
                },
                "gender": {
                  "type": "string",
                  "example": "MALE | FEMALE",
                  "required": true,
                },
                "nip": {
                  "type": "string",
                  "example": "19757328",
                  "required": "For 'INSTRUCTOR' Role Only",
                },
                "expertise": {
                  "type": "string",
                  "example": "Mathematics",
                  "required": "For 'INSTRUCTOR' Role Only",
                },
                "nisn": {
                  "type": "string",
                  "example": "30006789",
                  "required": "For 'STUDENT' Role Only",
                },
                "grade": {
                  "type": "string",
                  "example": "10 | 11 | 12",
                  "required": "For 'STUDENT' Role Only",
                },
                "majority": {
                  "type": "string",
                  "example": "Science",
                  "requird": "For 'STUDENT' Role Only",
                },
              }
            },
          },
          // "required": true,
        },
      },
      "responses": {
        "200": {
          "description": "Sign Up Success",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Email has been sent",
                "data": {}
              }
            }
          }
        },
        "403": {
          "description": "Sign Up Failed",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error Message>",
                "data": {}
              }
            }
          }
        }
      }
    }
  },
  '/auth/account/verify': {
    "post": {
      "tags": ["Auth"],
      "summary": "Verify Account",
      "description": "Verify New User Account",
      "operationId": "verifyAccount",
      "requestBody": {
        "description": "Input Verify Account Data",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "token": {
                  "type": "string",
                  "example": "09fda21f-349ufda0f-fdas",
                  "required": true,
                },
                "userId": {
                  "type": "number",
                  "example": 2,
                  "required": true,
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Verify Account Success",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Account Activated",
                "data": {}
              },
            }
          }
        },
        "403": {
          "description": "Verify Account Failed",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error message>",
                "data": {},
              }
            }
          }
        }
      }
    },
  },
  "/auth/signin": {
    "post": {
      "tags": ["Auth"],
      "summary": "Sign In User",
      "description": "Sign In User",
      "operationId": "signIn",
      "requestBody": {
        "description": "Input Sign In Data",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string",
                  "example": "user@mail.com",
                  "required": true
                },
                "password": {
                  "type": "string",
                  "example": "12345678",
                  "required": true
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Sign In Success",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Sign In Success",
                "data": {}
              }
            }
          }
        },
        "403": {
          "description": "Sign In Failed",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error Message>",
                "data": {}
              }
            }
          }
        }
      }
    }
  },
  "/auth/signout": {
    "post": {
      "security": [{
        "cookieAuth": []
      }],
      "tags": ["Auth"],
      "summary": "Sign Out User",
      "description": "Sign Out User",
      "operationId": "signOut",
      "responses": {
        "200": {
          "description": "Sign Out Success",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Sign Out Success",
                "data": {}
              }
            }
          }
        },
        "403": {
          "description": "Sign Out Failed",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error Message>",
                "data": {}
              }
            }
          }
        }
      }
    }
  },
  "/auth/password/send": {
    "post": {
      "tags": ["Auth"],
      "summary": "Send Change Password Email",
      "description": "Send Change Password Email",
      "operationId": "passwordSend",
      "requestBody": {
        "description": "Input Email Data",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string",
                  "example": "user@mail.com",
                  "required": true
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Email has been sent",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Email has been sent",
                "data": {}
              }
            }
          }
        },
        "403": {
          "description": "Failed to send email",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error Message>",
                "data": {}
              }
            }
          }
        }
      }
    }
  },
  "/auth/password/verify": {
    "post": {
      "security": [{
        "cookieAuth": []
      }],
      "tags": ["Auth"],
      "summary": "Verify New Password",
      "description": "Verify New Password",
      "operationId": "verifyPassword",
      "requestBody": {
        "description": "Change Password Data",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "userId": {
                  "type": "number",
                  "example": 69,
                  "required": true,
                },
                "password": {
                  "type": "string",
                  "example": "12345678",
                  "required": true,
                },
                "confirmPassword": {
                  "type": "string",
                  "example": "12345678",
                  "required": true,
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Verify New Password Success",
          "content": {
            "application/json": {
              "example": {
                "code": 200,
                "status": "success",
                "message": "Password Changed",
                "data": {}
              }
            }
          }
        },
        "403": {
          "description": "Verify New Password Failed",
          "content": {
            "application/json": {
              "example": {
                "code": 403,
                "status": "failed",
                "message": "<Error Message>",
                "data": {}
              }
            }
          }
        }
      }
    }
  }
}