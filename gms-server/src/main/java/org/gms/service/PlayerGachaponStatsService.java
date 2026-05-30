package org.gms.service;

import com.mybatisflex.core.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.gms.dao.entity.PlayerGachaponStatsDO;
import org.gms.dao.mapper.PlayerGachaponStatsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 玩家抽奖统计服务
 */
@Slf4j
@Service
public class PlayerGachaponStatsService {
    
    @Autowired
    private PlayerGachaponStatsMapper playerGachaponStatsMapper;
    
    /**
     * 增加抽奖机抽奖次数
     */
    @Transactional
    public void incrementGachaponCount(Integer characterId, String characterName) {
        incrementCount(characterId, characterName, true);
    }
    
    /**
     * 增加远程抽奖次数
     */
    @Transactional
    public void incrementRemoteGachaponCount(Integer characterId, String characterName) {
        incrementCount(characterId, characterName, false);
    }
    
    /**
     * 增加抽奖次数
     */
    private void incrementCount(Integer characterId, String characterName, boolean isGachapon) {
        PlayerGachaponStatsDO stats = playerGachaponStatsMapper.selectOneByQuery(
            QueryWrapper.create().eq("character_id", characterId)
        );
        
        if (stats == null) {
            stats = new PlayerGachaponStatsDO();
            stats.setCharacterId(characterId);
            stats.setCharacterName(characterName);
            stats.setTotalGachaponCount(isGachapon ? 1 : 0);
            stats.setRemoteGachaponCount(isGachapon ? 0 : 1);
            stats.setTotalCount(1);
            stats.setCreatedAt(LocalDateTime.now());
            stats.setUpdatedAt(LocalDateTime.now());
            playerGachaponStatsMapper.insert(stats);
        } else {
            if (isGachapon) {
                stats.setTotalGachaponCount(stats.getTotalGachaponCount() + 1);
            } else {
                stats.setRemoteGachaponCount(stats.getRemoteGachaponCount() + 1);
            }
            stats.setTotalCount(stats.getTotalCount() + 1);
            stats.setCharacterName(characterName);
            stats.setUpdatedAt(LocalDateTime.now());
            playerGachaponStatsMapper.update(stats);
        }
    }
    
    /**
     * 获取玩家抽奖统计
     */
    public PlayerGachaponStatsDO getPlayerStats(Integer characterId) {
        return playerGachaponStatsMapper.selectOneByQuery(
            QueryWrapper.create().eq("character_id", characterId)
        );
    }
    
    /**
     * 获取总抽奖次数
     */
    public int getTotalCount(Integer characterId) {
        PlayerGachaponStatsDO stats = getPlayerStats(characterId);
        return stats != null ? stats.getTotalCount() : 0;
    }
    
    /**
     * 获取抽奖机抽奖次数
     */
    public int getGachaponCount(Integer characterId) {
        PlayerGachaponStatsDO stats = getPlayerStats(characterId);
        return stats != null ? stats.getTotalGachaponCount() : 0;
    }
    
    /**
     * 获取远程抽奖次数
     */
    public int getRemoteGachaponCount(Integer characterId) {
        PlayerGachaponStatsDO stats = getPlayerStats(characterId);
        return stats != null ? stats.getRemoteGachaponCount() : 0;
    }
    
    /**
     * 扣除抽奖次数
     * @param characterId 角色ID
     * @param count 扣除次数
     * @return 是否扣除成功
     */
    @Transactional
    public boolean deductTotalCount(Integer characterId, int count) {
        PlayerGachaponStatsDO stats = playerGachaponStatsMapper.selectOneByQuery(
            QueryWrapper.create().eq("character_id", characterId)
        );
        
        if (stats == null || stats.getTotalCount() < count) {
            return false;
        }
        
        stats.setTotalCount(stats.getTotalCount() - count);
        stats.setUpdatedAt(LocalDateTime.now());
        playerGachaponStatsMapper.update(stats);
        return true;
    }
    
    /**
     * 获取可保底次数
     * @param characterId 角色ID
     * @param guaranteedCount 保底需要的次数（默认10）
     * @return 可保底次数
     */
    public int getGuaranteedDrawCount(Integer characterId, int guaranteedCount) {
        int totalCount = getTotalCount(characterId);
        return totalCount / guaranteedCount;
    }
}