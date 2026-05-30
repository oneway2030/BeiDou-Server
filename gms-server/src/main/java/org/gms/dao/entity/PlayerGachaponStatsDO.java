package org.gms.dao.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 玩家抽奖统计实体
 */
@Data
@Table("player_gachapon_stats")
public class PlayerGachaponStatsDO {
    
    @Id(keyType = KeyType.Auto)
    private Long id;
    
    /**
     * 角色ID
     */
    private Integer characterId;
    
    /**
     * 角色名称
     */
    private String characterName;
    
    /**
     * 抽奖机抽奖总次数
     */
    private Integer totalGachaponCount;
    
    /**
     * 远程抽奖总次数
     */
    private Integer remoteGachaponCount;
    
    /**
     * 总抽奖次数
     */
    private Integer totalCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}