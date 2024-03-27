import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Eventify API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API endpoints',
        },
        tags: [
            {
                name: 'Users',
                description: 'User management APIs',
            },
            {
                name: 'Events',
                description: 'Event management APIs',
            },
            {
                name: 'Invitations',
                description: 'Invitation management APIs',
            },
            {
                name: 'Notifications',
                description: 'Notification APIs',
            },
            {
                name: 'Feedbacks',
                description: 'Feedbacks APIs',
            },
        ],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        deletedAt: { type: 'string', format: 'date-time' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        mobileNo: { type: 'string' },
                        imageUrl: { type: 'string' },
                    },
                },
                Event: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'The unique identifier for the event.' },
                        createdAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the event was created.' },
                        updatedAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the event was last updated.' },
                        deletedAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the event was deleted.' },
                        title: { type: 'string', description: 'The title of the event.' },
                        description: { type: 'string', description: 'The description of the event.' },
                        location: { type: 'string', description: 'The location of the event.' },
                        startDate: { type: 'string', format: 'date-time', description: 'The start date and time of the event.' },
                        endDate: { type: 'string', format: 'date-time', description: 'The end date and time of the event.' },
                        userId: { type: 'integer', description: 'The ID of the user associated with the event.' },
                        status: {
                            type: "string",
                            enum: ['CONFIRMED', 'TENTATIVE', 'CANCELLED'],
                            description: "The invitation response status of participant user"
                        },
                        media: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', description: 'The unique identifier for the media associated with the event.' },
                                createdAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the media was created.' },
                                updatedAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the media was last updated.' },
                                deletedAt: { type: 'string', format: 'date-time', nullable: true, description: 'The timestamp when the media was deleted.' },
                                images: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The URLs of the images associated with the event.' },
                                videos: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The URLs of the videos associated with the event.' },
                                documents: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The URLs of the documents associated with the event.' },
                                eventId: { type: 'integer', description: 'The ID of the event associated with the media.' }
                            }
                        },
                    }
                },
                Notification: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "The unique identifier of the notification",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the notification was created"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the notification was last updated"
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the notification was deleted (if applicable)"
                        },
                        message: {
                            type: "string",
                            description: "The content of the notification message"
                        },
                        userId: {
                            type: "integer",
                            description: "The ID of the user to whom the notification belongs"
                        },
                        read: {
                            type: "integer",
                            description: "Indicates whether the notification has been read (0 for unread, 1 for read)"
                        }
                    }
                },
                Invitation: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "The unique identifier of the Invitation",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the Invitation was created"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the Invitation was last updated"
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the Invitation was deleted (if applicable)"
                        },
                        status: {
                            type: "string",
                            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'TENTATIVE'],
                            description: "The invitation response status of participant user"
                        },
                        checkin: {
                            type: "integer",
                            description: "The checkin status of participant user"
                        },
                        checkinTime: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the User checkin"
                        },
                        rsvp: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    description: "Title of Custom RSVP"
                                }
                            }
                        },
                        rsvpResponse: {
                            type: "object",
                            properties: {
                                options: {
                                    type: "boolean",
                                    description: "Response options for the given rsvp"
                                }
                            }
                        },
                        userId: {
                            type: "integer",
                            description: "The ID of the user to whom the feedback belongs"
                        },
                        eventId: {
                            type: "integer",
                            description: "The ID of the event to which the feedback belongs"
                        }
                    }
                },
                Feedback: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "The unique identifier of the notification",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the feedback was created"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the feedback was last updated"
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time when the feedback was deleted (if applicable)"
                        },
                        comment: {
                            type: "string",
                            description: "The content of the feedback message"
                        },
                        userId: {
                            type: "integer",
                            description: "The ID of the user to whom the feedback belongs"
                        },
                        eventId: {
                            type: "integer",
                            description: "The ID of the event to which the feedback belongs"
                        }
                    }
                }
            },
            requestBodies: {
                createEventRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                    },
                    required: ['title', 'description', 'startDate', 'endDate'],
                },
                updateRequest: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        imageUrl: { type: 'string' },
                        mobileNo: { type: 'string' },
                    },
                },
                updateEventRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'The updated title of the event.' },
                        description: { type: 'string', description: 'The updated description of the event.' },
                        startDate: { type: 'string', format: 'date-time', description: 'The updated start date and time of the event.' },
                        endDate: { type: 'string', format: 'date-time', description: 'The updated end date and time of the event.' },
                        location: { type: 'string', description: 'The updated location of the event.' },
                        media: {
                            type: 'object',
                            properties: {
                                images: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The updated URLs of the images associated with the event.' },
                                videos: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The updated URLs of the videos associated with the event.' },
                                documents: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'The updated URLs of the documents associated with the event.' }
                            }
                        }
                    },
                    additionalProperties: false
                },
                createFeedbackRequest: {
                    type: 'object',
                    properties: {
                        comment: { type: 'string' },
                        eventId: { type: 'integer' },
                    },
                    required: ['comment', 'eventId'],
                },
                createInvitationRequest: {
                    type: 'object',
                    properties: {
                        rsvp: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    description: "Title of Custom RSVP"
                                }
                            }
                        },
                        rsvpResponse: {
                            type: "object",
                            properties: {
                                options: {
                                    type: "boolean",
                                    description: "Response options for the given rsvp"
                                }
                            }
                        },
                        userIds: { type: 'array', items: { type: 'integer'} },
                        eventId: { type: 'integer' },
                    },
                    required: ['rsvp', 'rsvpResponse', 'eventId', 'userIds'],
                },
                updateInvitationRequest: {
                    type: 'object',
                    properties: {
                        rsvp: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    description: "Title of Custom RSVP"
                                }
                            }
                        },
                        rsvpResponse: {
                            type: "object",
                            properties: {
                                options: {
                                    type: "boolean",
                                    description: "Response options for the given rsvp"
                                }
                            }
                        },
                        userIds: { type: 'array', items: { type: 'integer'} },
                        eventId: { type: 'integer' },
                    },
                    required: ['eventId'],
                },
            },
            responses: {
                successResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                    },
                },
                createEventResponse: {
                    description: 'Event created successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Event' },
                        },
                    },
                },
                eventResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates whether the request was successful or not.' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Event' },
                        }
                    },
                },
                feedbackResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates whether the request was successful or not.' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Feedback' },
                        }
                    },
                },
                invitationResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates whether the request was successful or not.' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Invitation' },
                        }
                    },
                },
                updateEventResponse: {
                    description: 'Event updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Event'
                            }
                        }
                    }
                },
                notFoundResponse: {
                    description: 'Event not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/notFound'
                            }
                        }
                    }
                }
            },


        },
    },
    apis: [`${__dirname}/src/routes/*.ts`], // Path to the API routes files
};




const specs = swaggerJsdoc(options);

export default specs;
