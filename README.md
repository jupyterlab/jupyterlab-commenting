# JupyterLab Commenting and Annotation

![Stability Experimental][badge-stability]

To experiment with the extension in a live notebook environment,

-   stable version: [![Binder (stable)][badge-binder]][binder-stable]
-   latest master: [![Binder (latest)][badge-binder]][binder-master]

This [JupyterLab][jupyterlab] extension

-   allows commenting on [JupyterLab][jupyterlab] notebook cells and within text documents.
-   allows for comment resolution and editing.
-   supports filtering and sorting comments.
-   exposes a comment viewer in a dedicated comment window.
-   Check out the project vision in the ["Press Release from the Future"](./press_release.md)!

![Annotating notebook cells](https://raw.githubusercontent.com/jupyterlab/jupyterlab-commenting/master/docs/img/usage-11.gif)

## Prerequisites

-   [JupyterLab][jupyterlab] (version >= 1.0.0)

## Installation

First, install the commenting service [JupyterLab][jupyterlab] server extension,

```bash
$ pip install jupyterlab-commenting-service
```

Then install the frontend [JupyterLab][jupyterlab] extension,

```bash
$ jupyter labextension install @jupyterlab/commenting-extension
```

## Usage

See the [Usage Guide](./docs/usage.md) to learn more about what features this extension offers.

## Contributing

This repository is in active development, and we welcome collaboration. For development guidance, please consult the [development guide](./docs/development.md).

If you have ideas or questions, feel free to open an issue, or, if you feel like getting your hands dirty, feel free to consult the project [roadmap](./ROADMAP.md) or tackle an existing issue by contributing a pull request.

We try to keep the current issues relevant and matched to relevant milestones.

<!-- links -->

[badge-stability]: https://img.shields.io/badge/stability-experimental-red.svg
[badge-binder]: https://mybinder.org/badge_logo.svg
[binder-stable]: https://mybinder.org/v2/gh/jupyterlab/jupyterlab-commenting/196cfd8d9012334cef45196b895f8ad1cef499d5?urlpath=lab%2Ftree%2Fnotebooks%2Fdemo.ipynb
[binder-master]: https://mybinder.org/v2/gh/jupyterlab/jupyterlab-commenting/master?urlpath=lab%2Ftree%2Fnotebooks%2Fdemo.ipynb
[jupyterlab]: https://github.com/jupyterlab/jupyterlab

<!-- /.links -->
