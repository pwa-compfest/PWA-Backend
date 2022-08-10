export default {
    "/users": {
        "get": {
            "tags": ["User"],
            "summary": "Get all users",
            "description": "Get all users",
            "consumes": ["application/json"],
            "security": [{
                "bearerAuth": []
            }],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "example": {
                                "code": 200,
                                "status": "success",
                                "message": "User retrieved successfully",
                                "data": [{
                                    "id": 1,
                                    "created_at": "2020-01-01 00:00:00",
                                    "updated_at": "2020-01-01 00:00:00"
                                }]
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized"
                }
            }
        }
    }
}