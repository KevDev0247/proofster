package network

import (
	"bytes"
	"encoding/json"
	"net/http"
	"sync"
)

func CallAlgorithm(
	stage int,
	algorithmUrl string,
	body map[string]interface{},
	resultChan chan<- map[string]interface{},
	errChan chan<- error,
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	payload, err := json.Marshal(body)
	if err != nil {
		errChan <- err
		return
	}

	resp, err := http.Post(
		algorithmUrl,
		"application/json",
		bytes.NewBuffer(payload),
	)
	if err != nil {
		errChan <- err
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		errChan <- err
		return
	}

	resultChan <- result
}
