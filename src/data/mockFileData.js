export const mockFileSystem = [
  {
    id: 1,
    name: "Folder 1",
    type: "folder",
    lastModified: new Date(
      Date.now() - Math.random() * 10000000000
    ).toLocaleDateString(),
    children: [
      {
        id: 2,
        name: "Subfolder 1.1",
        type: "folder",
        lastModified: new Date(
          Date.now() - Math.random() * 10000000000
        ).toLocaleDateString(),
        children: [
          {
            id: 3,
            name: "File 1.1.1",
            type: "file",
            lastModified: new Date(
              Date.now() - Math.random() * 10000000000
            ).toLocaleDateString(),
          },
          {
            id: 4,
            name: "Folder 1.1.2",
            type: "folder",
            lastModified: new Date(
              Date.now() - Math.random() * 10000000000
            ).toLocaleDateString(),
          },
        ],
      },
      {
        id: 4,
        name: "File 1.1",
        type: "file",
        lastModified: new Date(
          Date.now() - Math.random() * 10000000000
        ).toLocaleDateString(),
      },
    ],
  },
  {
    id: 5,
    name: "Folder 2",
    type: "folder",
    lastModified: new Date(
      Date.now() - Math.random() * 10000000000
    ).toLocaleDateString(),
    children: [],
  },
];
  