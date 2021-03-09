from certificate import generate
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

coordinates = []
name = "Nguyễn Văn A"
template_path = "template.png"
def onclick(event):
    x = event.xdata
    y = event.ydata
    plt.scatter(x, y)
    coordinates.append([x, y])
    plt.text(x, y, name,  fontsize=24)
    plt.show()

im = plt.imread(template_path)
fig, ax = plt.subplots()
ax.plot(0)
cid = fig.canvas.mpl_connect('button_press_event', onclick)
# plt.text(352.5, 321, "Nguyễn Văn A",  fontsize=24)
plt.imshow(im)
plt.title("Exit the editor to start the generation")
plt.show()

print(coordinates)
generate(template_path, [name], (coordinates[0][0], coordinates[0][1]))

print("Done!")
