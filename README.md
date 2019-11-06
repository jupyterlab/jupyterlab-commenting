# JupyterLab Commenting and Annotation

![Stability Experimental][badge-stability]
[![Binder][badge-binder]][binder]

```bash
pip install jupyterlab-commenting-service
jupyter labextension install @jupyterlab/commenting-extension
```

This JupyterLab extension

-   allows commenting on JupyterLab notebook cells and within text documents.
-   allows for comment resolution and editing.
-   supports filtering and sorting comments.
-   exposes a comment viewer in a dedicated comment window.
-   Check out the project vision in the ["Press Release from the Future"](./press_release.md)!

![Annotating notebook cells](https://raw.githubusercontent.com/jupyterlab/jupyterlab-commenting/master/docs/img/usage-11.gif)

## Usage

See the [Usage Guide](./docs/usage.md) to learn more about what features this extension offers.

## Contributing

This repository is in active development, and we welcome collaboration. For development guidance, please consult the [development guide](./docs/development.md).

If you have ideas or questions, feel free to open an issue, or, if you feel like getting your hands dirty, feel free to tackle an existing issue by contributing a pull request.

We try to keep the current issues relevant and matched to relevant milestones.

<!-- links -->

[badge-stability]: https://img.shields.io/badge/stability-experimental-red.svg
[badge-binder]: https://mybinder.org/badge_logo.svg
[binder]: https://mybinder.org/v2/gh/jupyterlab/jupyterlab-commenting/master?urlpath=lab

<!-- /.links -->

## Feature Roadmap
- [ ] Opening a new thread...
    - [ ] on files in the file broswer.
    - [ ] on files open in the main work area.
    - [ ] on datasets in the data registry.
    - [ ] on a cell in a tabular dataset.
    - [ ] on a range of cells in a tabular dataset.
    - [ ] on character in a notebook cell input.
    - [ ] on a notebook cell output. 
    - [ ] on a text selecting in a text file.
    - [ ] on a single line of code in a text file.
- [ ] Replying to a thread.
- [ ] Resolving a thread.
- [ ] Deleting a thread.
- [ ] Promoting a thread to the 'knowledge graph'.
    - [ ] Promoting an individual comment to the 'knowledge graph'.
- [ ] Import an existing comment store.
- [ ] Export a comment store.
- [ ] Filter/Sort
    - [ ] Only show comments with targets on screen
    - [ ] Filter by target type
    - [ ] Show all comments
    - [ ] Sort by
        - Recently edited
        - Thread opened date
        - Unresolved
        - Unread
