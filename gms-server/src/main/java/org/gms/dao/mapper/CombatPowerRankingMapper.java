package org.gms.dao.mapper;

import com.mybatisflex.core.BaseMapper;
import org.gms.dao.entity.CombatPowerRankingDO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 战力排行榜 Mapper 接口
 */
public interface CombatPowerRankingMapper extends BaseMapper<CombatPowerRankingDO> {

    /**
     * 根据角色ID查询战力记录
     */
    @Select("SELECT * FROM combat_power_ranking WHERE character_id = #{characterId}")
    CombatPowerRankingDO selectByCharacterId(@Param("characterId") Integer characterId);

    /**
     * 获取战力排行榜（排除GM）
     */
    @Select("""
        SELECT c.id as characterId, c.name as characterName, c.job as jobId,
               SUM(men.str*10 + men.dex*10 + men.int*10 + men.luk*10 + men.watk*50 + men.matk*50 + men.wdef + men.mdef) as combatPower
        FROM characters c
        JOIN inventoryitems it ON c.id = it.characterid
        JOIN inventoryequipment men ON it.inventoryitemid = men.inventoryitemid
        WHERE c.gm <= 0 AND it.position < 0
        GROUP BY c.id, c.name, c.job
        ORDER BY combatPower DESC
        LIMIT #{limit}
        """)
    List<CombatPowerRankingDO> selectRankingList(@Param("limit") int limit);

    /**
     * 计算角色装备战力评分
     */
    @Select("""
        SELECT SUM(men.str*10 + men.dex*10 + men.int*10 + men.luk*10 + men.watk*50 + men.matk*50 + men.wdef + men.mdef) as combatPower
        FROM inventoryitems it
        JOIN inventoryequipment men ON it.inventoryitemid = men.inventoryitemid
        WHERE it.characterid = #{characterId} AND it.position < 0
        """)
    CombatPowerRankingDO calculateCombatPower(@Param("characterId") int characterId);

    /**
     * 获取角色装备详情
     */
    @Select("""
        SELECT it.itemid, it.position,
               men.str, men.dex, men.int, men.luk,
               men.watk, men.matk, men.wdef, men.mdef,
               men.upgradeslots, men.level,
               men.str*10 + men.dex*10 + men.int*10 + men.luk*10 + men.watk*50 + men.matk*50 + men.wdef + men.mdef as combatPower
        FROM inventoryitems it
        JOIN inventoryequipment men ON it.inventoryitemid = men.inventoryitemid
        WHERE it.characterid = #{characterId} AND it.position < 0
        ORDER BY it.position ASC
        """)
    List<CombatPowerRankingDO> selectEquipDetails(@Param("characterId") int characterId);
}
