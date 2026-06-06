package org.gms.service;

import com.mybatisflex.core.query.QueryWrapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gms.dao.entity.CombatPowerRankingDO;
import org.gms.dao.mapper.CombatPowerRankingMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 战力系统服务类
 */
@Service
@AllArgsConstructor
@Slf4j
public class CombatPowerService {
    private final CombatPowerRankingMapper combatPowerRankingMapper;

    /**
     * 获取角色战力评分（根据装备计算）
     * @param characterId 角色ID
     * @return 战力评分
     */
    public int getCharacterCombatPower(int characterId) {
        try {
            CombatPowerRankingDO result = combatPowerRankingMapper.calculateCombatPower(characterId);
            if (result != null && result.getCombatPower() != null) {
                return result.getCombatPower().intValue();
            }
        } catch (Exception e) {
            log.error("计算角色战力失败, characterId: {}", characterId, e);
        }
        return 0;
    }

    /**
     * 获取战力排行榜（排除GM）
     * @param limit 返回数量限制
     * @return 排行榜列表
     */
    public List<CombatPowerRankingDO> getCombatPowerRanking(int limit) {
        try {
            return combatPowerRankingMapper.selectRankingList(limit);
        } catch (Exception e) {
            log.error("获取战力排行榜失败", e);
            return List.of();
        }
    }

    /**
     * 获取指定角色的装备战力详情
     * @param characterId 角色ID
     * @return 装备战力详情列表
     */
    public List<CombatPowerRankingDO> getCharacterEquipDetails(int characterId) {
        try {
            return combatPowerRankingMapper.selectEquipDetails(characterId);
        } catch (Exception e) {
            log.error("获取角色装备详情失败, characterId: {}", characterId, e);
            return List.of();
        }
    }

    /**
     * 更新或插入角色战力记录
     * @param characterId 角色ID
     * @param combatPower 战力值
     * @return 是否成功
     */
    @Transactional
    public boolean updateCombatPower(int characterId, int combatPower) {
        try {
            CombatPowerRankingDO existing = combatPowerRankingMapper.selectByCharacterId(characterId);
            if (existing != null) {
                if (existing.getCombatPower() == null || existing.getCombatPower().intValue() < combatPower) {
                    existing.setCombatPower(BigDecimal.valueOf(combatPower));
                    combatPowerRankingMapper.update(existing);
                }
            } else {
                CombatPowerRankingDO newRecord = CombatPowerRankingDO.builder()
                    .characterId(characterId)
                    .combatPower(BigDecimal.valueOf(combatPower))
                    .build();
                combatPowerRankingMapper.insert(newRecord);
            }
            return true;
        } catch (Exception e) {
            log.error("更新战力记录失败, characterId: {}, combatPower: {}", characterId, combatPower, e);
            return false;
        }
    }
}
