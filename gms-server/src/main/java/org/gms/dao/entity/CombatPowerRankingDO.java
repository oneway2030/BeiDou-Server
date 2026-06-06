package org.gms.dao.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 战力排行榜实体类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("combat_power_ranking")
public class CombatPowerRankingDO {
    @Id(keyType = KeyType.Auto)
    private Long id;

    private Integer characterId;
    
    private String characterName;
    
    private Integer jobId;
    
    private BigDecimal combatPower;
    
    // 装备详情字段（非数据库字段）
    private Integer itemid;
    private Integer position;
    private Integer str;
    private Integer dex;
    private Integer intAttr;  // int 是 Java 关键字，使用 intAttr
    private Integer luk;
    private Integer watk;
    private Integer matk;
    private Integer wdef;
    private Integer mdef;
    private Integer upgradeSlots;
    private Integer level;
}
