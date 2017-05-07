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

現在位置を `<X>` `<Y>` に設定する

```
line <X> <Y>
```

現在位置から `<X>` `<Y>` だけ移動して線を引く

```
lineTo <X> <Y>
```

現在位置から `<X>` `<Y>` に移動して線を引く

```
curveTo <X> <Y> <X1> <Y1> <X2> <Y2>
```

現在位置から `<X>` `<Y>` に移動して線を引く
`<X1>` `<Y1>` `<X2>` `<Y2>` はコントロールポイント

```
circle <半径X> (<半径Y>)
```

現在位置に円を配置する

<半径Y> を省略した場合は <半径X> が使われる

```
rect <幅> <高さ>
```

現在位置に矩形を配置する

```
text <文字列>
```

現在位置にテキストを配置する

## 描画コマンド

```
stroke <色>
```

現在のパスの線を描画し、パスをリセットする

```
fill <色>
```

現在のパスを塗りつぶし、パスをリセットする

```
strokeWidth <線幅>
```

現在のパスの線幅を変える

```
fontSize <文字サイズ>
```

現在の text の文字サイズを変える

## 座標系コマンド

```
grid <スケール>
```

グリッドを描画し、以降の描画のスケールを設定する

## 操作コマンド

既存のオブジェクトに対して操作を行うコマンド

対象となるオブジェクトは次のルールで決まる

- @ で指定されたオブジェクト
- なければ選択されたオブジェクト
- なければ直前に描画したオブジェクト

`<名前>`: `name` で付けた名前 (デフォルトは0から始まる通し番号)

@ で指定した場合はその行でのみ選択状態となり、次の行からは元の状態に戻る

### `name`

- オブジェクトに名前を付ける

### `select <名前> <名前> ...`

- 指定された名前のオブジェクトを選択する

### `select1 <名前>`

- 指定された名前のオブジェクトだけを選択する

### `copy`

- オブジェクトを現在位置にコピーする

### `translate <X> <Y>`

- オブジェクトを X Y 分だけ移動する

### `translateTo <X> <Y>`

- オブジェクトを X Y に移動する

### `resize <横幅> <高さ> (アンカーX) (アンカーY)`

- オブジェクトのサイズを変更する
- アンカーはシェイプ中の位置を固定する場所 (0 0 なら左上を固定、0.5 0.5 なら中心を固定する)

### `dist <軸> <間隔>`

- オブジェクトを均等に配置する
- 軸には x, y を指定できる

### `align <軸>`

- 軸にオブジェクトの位置を揃える

### `mirror <軸>` `未実装`

- 指定された軸を中心にオブジェクトを反転コピーする

### `group <名前> <名前> ...` `未実装`

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
- x, y はそれぞれ center (c), middle (m) と同等

![default](https://cloud.githubusercontent.com/assets/5355966/20027562/c79e41a4-a35a-11e6-94bd-a75d631e5a91.png)

## マウス入力

- オブジェクトをクリックして選択
  - Shift キーを押しながら複数選択
- オブジェクトをドラッグして移動
- オブジェクト選択時に表示されるハンドルをドラッグしてサイズ変更
- オブジェクト選択時に表示されるハンドルの外側をドラッグして回転 `未実装`
