package org.gms.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Data
public class FileTreeNodeDTO {
    private String title;
    private String key;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<FileTreeNodeDTO> children;
    @JsonProperty("isLeaf")
    private boolean leaf;

    public FileTreeNodeDTO(File file, String key) {
        this.title = file.getName();
        this.key = key;
        this.children = file.isDirectory() ? Collections.emptyList() : null;
        this.leaf = !file.isDirectory();
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof FileTreeNodeDTO that)) return false;
        return Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, key, children, leaf);
    }

    @Override
    public String toString() {
        return "FileTreeNodeDTO{" +
                "title='" + title + '\'' +
                ", key='" + key + '\'' +
                ", children=" + children +
                ", leaf=" + leaf +
                '}';
    }
}
