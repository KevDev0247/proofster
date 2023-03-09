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

func GetSteps(c *gin.Context) {
	response := &models.Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
	}

	workspaceId := c.Query("workspace_id")
	algorithm := c.Query("algorithm")
	algo := -1
	if algorithm == "1" {
		algo = 1
	} else {
		algo = 0
	}

	clauses, err := services.GetClauses(
		workspaceId, algo,
	)
	if err != nil {
		response.Message = err.Error()
		response.SendResponse(c)
		return
	}

	if algo == 0 {
		procedure, err := services.GetNormalized(workspaceId)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}
	
		response.StatusCode = http.StatusOK
		response.Success = true
		response.Data = gin.H{
			"result": append(procedure, clauses...),
		}
		response.SendResponse(c)
	} else {
		procedure, err := services.GetPreprocessed(workspaceId)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}

		response.StatusCode = http.StatusOK
		response.Success = true
		response.Data = gin.H{
			"result": append(procedure, clauses...),
		}
		response.SendResponse(c)		
	}
}
