package routes

import (
	"proofster/algorithm/controllers"

	"github.com/gin-gonic/gin"
)

func NormalizeRoute(router *gin.RouterGroup, handlers ...gin.HandlerFunc) {
	normalize := router.Group("/normalize", handlers...)
	{
		normalize.GET(
			"/:workspace_id",
			controllers.Normalize,
		)
	}
}