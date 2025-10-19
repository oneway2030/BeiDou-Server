package org.gms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.gms.constants.api.ApiConstant;
import org.gms.model.dto.*;
import org.gms.service.FileTreeService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
@RequestMapping("/file")
public class FileController {
    private final FileTreeService fileTreeService;

    @Tag(name = "/file/" + ApiConstant.LATEST)
    @Operation(summary = "读取文件")
    @PostMapping("/" + ApiConstant.LATEST + "/tree/read")
    public ResultBody<String> treeRead(@RequestBody SubmitBody<FileReadDTO> request) {
        return ResultBody.success(request, fileTreeService.readFile(request.getData().getCurrentKey(), request.getData().getTitle()));
    }

    @Tag(name = "/file/" + ApiConstant.LATEST)
    @Operation(summary = "写入文件")
    @PostMapping("/" + ApiConstant.LATEST + "/tree/write")
    public ResultBody<String> treeWrite(@RequestBody SubmitBody<FileWriteDTO> request) {
        fileTreeService.writeFile(request.getData().getCurrentKey(), request.getData().getTitle(), request.getData().getContent());
        return ResultBody.success(request,"写入成功");
    }

    @Tag(name = "/file/" + ApiConstant.LATEST)
    @Operation(summary = "读取文件树")
    @PostMapping("/" + ApiConstant.LATEST + "/tree")
    public ResultBody<List<FileTreeNodeDTO>> tree(@RequestBody SubmitBody<FileTreeDTO> request) {
        //对文件进行倒叙排序
        List<FileTreeNodeDTO> tree = fileTreeService.tree(request.getData().getCurrentKey());
        tree.sort((a1, a2) -> {
            String title1 = a1.getTitle().replace(".js","");
            String title2 = a2.getTitle().replace(".js","");
            boolean isNum1 = title1.matches("\\d+");
            boolean isNum2 = title2.matches("\\d+");
            if (isNum1 && !isNum2) return -1;
            if (!isNum1 && isNum2) return 1;
            if (isNum1 && isNum2) return Long.compare(Long.parseLong(title2), Long.parseLong(title1));
            return title1.compareToIgnoreCase(title2);
        });
        return ResultBody.success(request, tree);
    }

}
