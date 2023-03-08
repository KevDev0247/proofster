package controllers

import (
	"net/http"
	"proofster/algorithm/models"
	"proofster/algorithm/services"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func Normalize(c *gin.Context) {
	response := &models.Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
	}

	var requestBody models.NormalizeRequest
	_ = c.ShouldBindBodyWith(&requestBody, binding.JSON)
	
	if requestBody.Stage == -1 {
		err := services.Transpile(requestBody.WorkspaceId)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}		
	} else {
		services.Normalize(
			requestBody.Stage, 
			requestBody.WorkspaceId,
			requestBody.Algorithm,
		)
	}
	
	response.StatusCode = http.StatusOK
	response.Success = true
	response.SendResponse(c)
}