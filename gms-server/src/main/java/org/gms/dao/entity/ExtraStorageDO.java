package org.gms.dao.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serial;

/**
 * 额外仓库实体类
 *
 * @author yourname
 * @since 2024-XX-XX
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("extrastorage")
public class ExtraStorageDO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 额外仓库记录ID（自增主键）
     */
    @Id(keyType = KeyType.Auto)
    private Long inventoryequipmentid;

    /**
     * 角色ID（关联角色）
     */
    private Long characterid;

    /**
     * 账号ID（关联账号）
     */
    private Long accountid;

    /**
     * 物品ID（对应物品模板）
     */
    private Long itemid;

    /**
     * 物品数量
     */
    private Integer quantity;

    /**
     *物品类型
     */
    private Integer type;
}