import swaggerUi from 'swagger-ui-express';

/**
 * Setup Swagger for the app
 * @param {import('express').Express} app
 */
export const setupSwagger = (app) => {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'AniToku API',
      version: '1.0.0',
      description: 'AniToku backend API for users and admin operations'
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    tags: [
      { name: 'Admin', description: 'Admin panel related endpoints' },
      { name: 'User', description: 'Regular user endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string', description: 'Hashed password' }
          }
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
          }
        },
        UserInput: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['username', 'email', 'password']
        },
        LoginInput: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['username', 'password']
        },
        RegisterInput: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['username', 'email', 'password']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserPublic' }
          }
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        }
      }
    },
    paths: {
      // === ADMIN ENDPOINTS ===
      '/admin/login': {
        post: {
          tags: ['Admin'],
          summary: 'Admin login',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } }
            }
          },
          responses: {
            '200': { 
              description: 'Admin token returned', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } 
            },
            '401': { description: 'Invalid credentials' }
          }
        }
      },
      '/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Barcha foydalanuvchilarni olish',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { 
              description: 'List of users', 
              content: { 
                'application/json': { 
                  schema: { 
                    type: 'array', 
                    items: { $ref: '#/components/schemas/UserPublic' } 
                  } 
                } 
              } 
            },
            '403': { description: 'Forbidden' }
          }
        },
        post: {
          tags: ['Admin'],
          summary: 'Yangi foydalanuvchi yaratish',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } }
          },
          responses: {
            '201': { 
              description: 'User created', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPublic' } } } 
            },
            '403': { description: 'Forbidden' }
          }
        }
      },
      '/admin/users/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Foydalanuvchini tahrirlash',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { 
            required: true, 
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } 
          },
          responses: {
            '200': { 
              description: 'User updated', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPublic' } } } 
            },
            '403': { description: 'Forbidden' },
            '404': { description: 'User not found' }
          }
        },
        delete: {
          tags: ['Admin'],
          summary: 'Foydalanuvchini o‘chirish',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'User deleted' },
            '403': { description: 'Forbidden' },
            '404': { description: 'User not found' }
          }
        }
      },
      '/admin/users/{id}/password': {
        get: {
          tags: ['Admin'],
          summary: 'Foydalanuvchi parolini ko‘rish (hashed)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { 
              description: 'Hashed password returned', 
              content: { 'application/json': { schema: { type: 'string' } } } 
            },
            '403': { description: 'Forbidden' },
            '404': { description: 'User not found' }
          }
        }
      },

      // === USER ENDPOINTS ===
      '/users': {
        get: {
          tags: ['User'],
          summary: 'Barcha foydalanuvchilarni olish (public info)',
          responses: {
            '200': { 
              description: 'List of users (public fields only)', 
              content: { 
                'application/json': { 
                  schema: { 
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UserPublic' }
                      }
                    }
                  } 
                } 
              } 
            }
          }
        }
      },

      // === AUTH ENDPOINTS ===
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Foydalanuvchi ro‘yxatdan o‘tkazish',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } }
            }
          },
          responses: {
            '201': { 
              description: 'User registered successfully', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } 
            },
            '400': { description: 'All fields required' },
            '409': { description: 'User already exists' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Foydalanuvchi tizimga kirish',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } }
            }
          },
          responses: {
            '200': { 
              description: 'Login successful', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } 
            },
            '400': { description: 'All fields required' },
            '401': { description: 'Invalid credentials' },
            '500': { description: 'Server error' }
          }
        }
      }
    }
  };

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: { persistAuthorization: true }
  }));
};