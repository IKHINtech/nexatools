package toolregistry

import "testing"

func TestRegistryListToolsSorted(t *testing.T) {
	reg := New([]Tool{
		{ID: "text.base64", Category: "text", Status: StatusActive},
		{ID: "archive.zip", Category: "archive", Status: StatusInactive},
	})

	tools := reg.ListTools()
	if len(tools) != 2 {
		t.Fatalf("len(ListTools()) = %d, want 2", len(tools))
	}
	if tools[0].ID != "archive.zip" || tools[0].Status != StatusInactive {
		t.Fatalf("tools[0] = %+v, want archive.zip inactive", tools[0])
	}
	if tools[1].ID != "text.base64" || tools[1].Status != StatusActive {
		t.Fatalf("tools[1] = %+v, want text.base64 active", tools[1])
	}
}
