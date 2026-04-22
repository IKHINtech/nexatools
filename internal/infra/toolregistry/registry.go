package toolregistry

import "sort"

type Status string

const (
	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
)

type Tool struct {
	ID           string   `json:"id"`
	Category     string   `json:"category"`
	Status       Status   `json:"status"`
	Dependencies []string `json:"dependencies,omitempty"`
	Description  string   `json:"description,omitempty"`
}

type Registry struct {
	tools []Tool
}

func New(tools []Tool) *Registry {
	cloned := append([]Tool(nil), tools...)
	sort.Slice(cloned, func(i, j int) bool {
		return cloned[i].ID < cloned[j].ID
	})
	return &Registry{tools: cloned}
}

func (r *Registry) ListTools() []Tool {
	return append([]Tool(nil), r.tools...)
}
