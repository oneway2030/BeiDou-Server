package org.gms.net.server.channel;

import org.gms.client.Character;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ChannelListenerManager {
    // 线程安全的监听器列表
    private static final List<MapTransitionCallback> listeners = new CopyOnWriteArrayList<>();

    // 添加监听器
    public static void addListener(MapTransitionCallback listener) {
        listeners.add(listener);
    }

    // 触发回调并移除一次性监听器
    public static void onMapTransitionComplete(Character chr, int oldMapId, int newMapId) {
        // 迭代副本避免并发修改异常
        for (MapTransitionCallback listener : new ArrayList<>(listeners)) {
            listener.onMapTransitionComplete(chr, oldMapId, newMapId);
            // 移除监听
            listeners.remove(listener);
        }
    }

    public interface MapTransitionCallback {
        void onMapTransitionComplete(Character chr, int oldMapId, int newMapId);
    }
}