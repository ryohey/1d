# 1D

ジオメトリックデザインツール

## キーボード入力

例

```
move 20 30
line 30 30
stroke blue
```

- キャンセル: Ctrl-Z (controller.undo()) `未実装`
- @ と入力したとき、指定idの点がハイライトされる `未実装`
- 入力途中でもプレビューされる `未実装`

塗りが確定していないオブジェクトは点滅する線で表現される `未実装`

## パスを作成するコマンド

```
move <X> <Y>
```

現在位置から X Y に移動する

```
moveTo <X> <Y>
```

現在位置を X Y に設定する

```
line <X> <Y>
```

現在位置から線を引く

```
circle <半径>
```

現在位置に円を配置する

```
rect <幅> <高さ>
```

現在位置に矩形を配置する

## 描画コマンド

```
stroke <色>
```

現在のパスの線を描画し、パスをリセットする

```
fill <色>
```

現在のパスを塗りつぶし、パスをリセットする

## 操作コマンド `未実装`

既存のオブジェクトに対して操作を行うコマンド

対象となるオブジェクトは次のルールで決まる

- @ で指定されたオブジェクト
- なければ選択されたオブジェクト
- なければ直前のオブジェクト

```
copy <個数>
```

- オブジェクトを指定個数だけ同じ位置に複製し、選択状態にする

```
dist <軸> <間隔>
```

- オブジェクトを均等に配置する
- 軸としてオブジェクトが指定された場合、そのパスに沿うように均等に配置する
- 軸には暗黙的な変数 x, y が使用できる
- 間隔を指定しなかった場合は軸の長さを均等に分割するように配置する
- 軸、間隔を両方とも指定しなかった場合は選択されたオブジェクトの最も外側のものが作る対角線を軸とする


```
distX <間隔>
```

- 横方向だけ変更し、オブジェクトを均等に配置する
間隔を指定した場合は左から配置する

```
distY <間隔>
```

- 縦方向だけ変更し、オブジェクトを均等に配置する
- 間隔を指定した場合は上から配置する

```
mirror <軸>
```

- 指定された軸を中心にオブジェクトを反転コピーする

```
group <名前> <名前> ...
```

- 指定された名前のオブジェクトをグループとしてひとつのオブジェクトにし、選択状態にする
- 名前が指定されない場合は、現在のオブジェクトをグループとしてひとつのオブジェクトにし、選択状態にする

例

```
# 円をコピーしてグループ化する
move 10 20
circle 30
fill blue
copy 3
dist x 60
mirror r
group
name circles

# ガイドを軸にミラーリングする
move 0 30
line 500 30
line blue
name guide
@circles mirror guide
```

## 暗黙的な変数 `未実装`

自動的に生成される変数

- 選択されたオブジェクトが作る矩形の軸 x, y, t, r, b, l

![default](https://cloud.githubusercontent.com/assets/5355966/20027562/c79e41a4-a35a-11e6-94bd-a75d631e5a91.png)

## マウス入力 `未実装`

クリックすると対象を指定する命令 `@<id>` が文頭に入る
ドラッグ中、座標が変化していく
全ての入力はコンソール (controller) を通じて行う

controller.undo()
controller.put("@1 move 30 30")

```
@1 move 30 30
```
