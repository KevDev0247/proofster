package routes

import (
	"proofster/algorithm/controllers"

	"github.com/gin-gonic/gin"
)

func AlgorithmRoute(router *gin.RouterGroup, handlers ...gin.HandlerFunc) {
	normalize := router.Group("/normalize", handlers...)
	{
		normalize.POST(
			"",
			controllers.Normalize,
		)
		normalize.GET(
			"",
			controllers.GetSteps,
		)
		normalize.GET(
			"metadata",
			controllers.GetMetadata,
		)
	}
}
