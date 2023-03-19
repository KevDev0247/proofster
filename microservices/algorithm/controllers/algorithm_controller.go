package controllers

import (
	"net/http"
	models "proofster/algorithm/models"
	services "proofster/algorithm/services"

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
		err := services.Normalize(
			requestBody.Stage,
			requestBody.WorkspaceId,
			requestBody.Algorithm,
		)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}
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
	algorithmInput := c.Query("algorithm")
	algorithm := -1
	if algorithmInput == "1" {
		algorithm = 1
	} else {
		algorithm = 0
	}

	clauses, err := services.BuildClauses(
		workspaceId, algorithm,
	)
	if err != nil {
		response.Message = err.Error()
		response.SendResponse(c)
		return
	}

	if algorithm == 0 {
		procedure, err := services.BuildOrderedNormalized(workspaceId)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}

		if append(procedure, clauses...) != nil {
			response.Data = gin.H{
				"results": append(procedure, clauses...),
			}
		} else {
			response.Data = gin.H{
				"results": []string{},
			}
		}
		response.StatusCode = http.StatusOK
		response.Success = true
		response.SendResponse(c)
	} else {
		procedure, err := services.BuildOrderedPreprocessed(workspaceId)
		if err != nil {
			response.Message = err.Error()
			response.SendResponse(c)
			return
		}

		if append(procedure, clauses...) != nil {
			response.Data = gin.H{
				"results": append(procedure, clauses...),
			}
		} else {
			response.Data = gin.H{
				"results": []string{},
			}
		}
		response.StatusCode = http.StatusOK
		response.Success = true
		response.SendResponse(c)
	}
}

func GetMetadataByWorkspace(c *gin.Context) {
	response := &models.Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
	}

	workspaceId := c.Query("workspace_id")

	metadata, err := services.GetMetadataByWorkspace(workspaceId)
	if err != nil {
		response.Message = err.Error()
		response.SendResponse(c)
		return
	}

	if metadata != nil {
		response.Data = gin.H{
			"results": *metadata,
		}
	} else {
		response.Data = gin.H{
			"results": nil,
		}
	}
	response.StatusCode = http.StatusOK
	response.Success = true
	response.SendResponse(c)
}

func GetMetadata(c *gin.Context) {
	response := &models.Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
	}

	metadatas, err := services.GetMetadata()
	if err != nil {
		response.Message = err.Error()
		response.SendResponse(c)
		return
	}
	
	response.Data = gin.H{
		"results": metadatas,
	}
	response.StatusCode = http.StatusOK
	response.Success = true
	response.SendResponse(c)
}
