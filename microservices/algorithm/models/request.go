package models

import (
	"regexp"

	validation "github.com/go-ozzo/ozzo-validation"
)

type RefreshRequest struct {
	Token string `json:"token"`
}

func (a RefreshRequest) Validate() error {
	return validation.ValidateStruct(&a,
		validation.Field(
			&a.Token,
			validation.Required,
			validation.Match(regexp.MustCompile(`^\\S+$`)).Error("cannot contain whitespaces"),
		),
	)
}

type NoteRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (a NoteRequest) Validate() error {
	return validation.ValidateStruct(&a,
		validation.Field(&a.Title, validation.Required),
		validation.Field(&a.Content, validation.Required),
	)
}

type NormalizeRequest struct {
	Stage       int    `json:"stage"`
	WorkspaceId string `json:"workspace_id"`
	Algorithm   int    `json:"algorithm"`
}

type MetadataRequest struct {
	WorkspaceId    string `json:"workspace_id"`
	IsTranspiled   *bool  `json:"is_transpiled,omitempty"`
	AllNormalized  *bool  `json:"all_normalized,omitempty"`
	IsPreprocessed *bool  `json:"is_preprocessed,omitempty"`
}
