"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makePostUserController;

function makePostUserController({
  addUserService
}) {
  return async httpRequest => {
    try {
      const { ...userInfo
      } = httpRequest.body;
      const posted = await addUserService({ ...userInfo
      });

      if (posted.message) {
        return {
          statusCode: 409,
          body: {
            success: false,
            ...posted
          }
        };
      }

      return {
        statusCode: 201,
        body: {
          success: true,
          message: "User created successfully",
          user: {
            userId: posted._id,
            username: posted.username,
            userEmail: posted.email,
            role: posted.role
          }
        }
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        statusCode: 400,
        body: {
          error: e.message
        }
      };
    }
  };
}