# 1D

ジオメトリックデザインツール

## キーボード入力

キャンセル: Ctrl-Z (controller.undo())

@ と入力したとき、指定idの点がハイライトされる
入力途中でもプレビューされる

```
move 20 30
line 30 30
mirrorY 100
```

## マウス入力 

クリックすると対象を指定する命令 `@<id>` が文頭に入る
ドラッグ中、座標が変化していく
全ての入力はコンソール (controller) を通じて行う

controller.undo()
controller.put("@1 move 30 30")

```
@1 move 30 30
```


