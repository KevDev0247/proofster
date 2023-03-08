package controllers

import (
	"net/http"
	"proofster/algorithm/models"
	"proofster/algorithm/services"

	"github.com/gin-gonic/gin"
)

func Normalize(c *gin.Context) {
	response := &models.Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
	}

	workspaceId := c.Param("workspace_id")
	
	err := services.Transpile(workspaceId)
	if err != nil {
		response.Message = err.Error()
		response.SendResponse(c)
		return
	}
	
	response.StatusCode = http.StatusOK
	response.Success = true
	response.SendResponse(c)
}