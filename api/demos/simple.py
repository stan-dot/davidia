from plot.utils import clear, image, line, scatter, table


def line_demo(p, no_x=False):
    if no_x:
        x = [1.5, 4.5, 3.5]
        y = None
        x_label = 'index'
    else:
        x = [5, 10, 15]
        y = [1.5, 4.5, 3.5]
        x_label = 'x-axis'
    line(
        x=x,
        y=y,
        plot_config={
            'x_label': x_label,
            'y_label': 'y-axis',
            'x_scale': 'linear',
            'y_scale': 'linear',
            'title': 'line demo plot'
        },
        plot_id=f"plot_{p}",
        line_on=False,
        point_size=8,
        color="red"
    )


def multiline_demo(p, no_x=False):
    if no_x:
        x = [[(v + 0.2 * i) for v in (1.5, 4.5, 3.5)] for i in range(3)]
        yds = None
        x_label = 'index'
    else:
        x = [5, 10, 15]
        yds = [[(v + 0.2 * i) for v in (1.5, 4.5, 3.5)] for i in range(3)]
        x_label = 'x-axis'
    line(
        x=x,
        y=yds,
        plot_config={
            'x_label': x_label,
            'y_label': 'y-axis',
            'x_scale': 'linear',
            'y_scale': 'linear',
            'title': 'multiline demo plot'
        },
        plot_id=f"plot_{p}",
        line_on=True
    )


def append_lines_demo(p, no_x=False):
    if no_x:
        x = [[-2.5, 0, 2.5], [], [14, 15, 14.2]]
        yds = None
    else:
        x = [[20, 25, 30], [], [20, 25, 30]]
        yds = [[-2.5, 0, 2.5], [], [14, 15, 14.2]]
    line(
        x=x,
        y=yds,
        append=True,
        plot_id=f"plot_{p}",
        line_on=True)


def append_more_lines_demo(p, no_x=False):
    if no_x:
        x = [[6, 10, 8], [5, 10, 17.2], []]
        yds = None
    else:
        x = [[35, 40, 45], [20, 25, 30], []]
        yds = [[6, 10, 8], [5, 10, 17.2], []]
    line(
        x=x,
        y=yds,
        append=True,
        plot_id=f"plot_{p}",
        line_on=True)


def heatmap_demo(p):
    image(
        values=[[5, 10, 15], [1.5, 4.5, 3.5]],
        domain=[0, 20],
        heatmap_scale='linear',
        colorMap='Plasma',
        plot_config={
            'x_label': 'x-axis',
            'y_label': 'y-axis',
            'x_values': [18, 20, 22, 24],
            'y_values': [-4, 0, 4],
            'title': 'heatmap demo plot'
        },
        plot_id=f"plot_{p}",
    )


def image_demo(p):
    image(
        values=[
            [[0, 255, 255], [255, 0, 255], [255, 255, 0], [0, 0, 255]],
            [[0, 0, 0], [85, 85, 85], [255, 255, 255], [170, 170, 170]],
        ],
        plot_config={
            'x_label': 'x-axis',
            'y_label': 'y-axis',
            'x_values': [4, 5, 6, 7, 8],
            'y_values': [7, 10, 13],
            'title': 'image demo plot'
        },
        plot_id=f"plot_{p}",
    )



def scatter_demo(p):
    scatter(
        xData=[x % 20 for x in range(20)],
        yData=[y % 10 for y in range(20)],
        dataArray=[6 * i for i in range(20)],
        domain=[0, 114],
        plot_config={
            'x_label': 'x-axis',
            'y_label': 'y-axis',
            'x_scale': 'log',
            'y_scale': 'linear',
            'title': 'scatter demo plot'
        },
        plot_id=f"plot_{p}",
    )


def table_demo(p):
    table(
        dataArray=[[6.23 * i for i in range(20)]] * 5,
        cellWidth=120,
        display_style='scientific',
        number_digits=1,
        plot_id=f"plot_{p}",
    )


def run_all_demos():
    from time import sleep

    WAIT = 3
    p = 0
    for _ in range(5):
        line_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        line_demo(p, True)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        heatmap_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        multiline_demo(p)
        sleep(WAIT)
        append_lines_demo(p)
        sleep(WAIT)
        append_more_lines_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        multiline_demo(p, True)
        sleep(WAIT)
        append_lines_demo(p, True)
        sleep(WAIT)
        append_more_lines_demo(p, True)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        image_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        scatter_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")
        table_demo(p)
        sleep(WAIT)

        p = 1 - p
        clear(f"plot_{p}")


if __name__ == "__main__":
    run_all_demos()
