/*
 *  Cliff - Happy Ville NPC
 */

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status > 0) {
            status--;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("你看到那边站着一群雪人吗？去和他们中的一个交谈，它会带你去这里著名的巨大圣诞树。这棵树可以用各种装饰品来装饰。你觉得怎么样？听起来很有趣，对吧？");
    } else if (status == 1) {
        cm.sendNextPrev("只有6个人可以同时在树所在的地方，你不能在那里进行交易或者开设商店。你丢下的饰品只能由你自己捡起来，所以不用担心在这里丢失你的饰品。");
    } else if (status == 2) {
        cm.sendNextPrev("当然，掉落在那里的物品永远不会消失。一旦你通过里面的雪人离开那里，你在那张地图上掉落的所有物品都会回到你身边，所以你离开那个地方之前不必捡起所有这些物品。是不是很方便呢？");
    } else if (status == 3) {
        cm.sendPrev("那么，去看看#r#p2002001##k，在那里买些圣诞装饰品，然后用那些装饰圣诞树~哦耶！最大、最漂亮的装饰品是买不到的。可能是。。。被怪物带走。。。啊哈。。");
        cm.dispose();
    } else {
            cm.dispose();
	}
}