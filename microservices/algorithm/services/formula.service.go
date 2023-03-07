package services

// import (
// 	"errors"
// 	db "proofster/algorithm/models/db"
// 	"github.com/kamva/mgm/v3"
// 	"go.mongodb.org/mongo-driver/bson"
// )

// func SaveBulkFormula(
// 	workspaceId string,
// )(error) {
// 	existing := []*db.Formula{}
	
// 	err := mgm.Coll(&db.Formula{}).SimpleFind(
// 		&existing,
// 		bson.M{"workspace_id": workspaceId},
// 	)

// 	if err != nil {
// 		return errors.New("cannot save formulas")
// 	}

// 	if len(existing) == 0 {
		
// 	} else {

// 	}

// 	return nil
// }
