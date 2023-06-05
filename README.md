# Marble FHIR Viewer

Marble FHIR Viewer provides the building blocks to display FHIR data in a human readable way.

## Getting Started

1. Clone the project (or use Github Codespaces)
2. Run `npm install`
3. Run `npm start`
4. Open [http://localhost:3000](http://localhost:3000) (or the mapped port from Gitbub Codespaces)

## Viewing FHIR resources
Marble FHIR Viewer supports json files with FHIR Resources. It was designed to visualize data for a single patient, however it will display any FHIR resources added to it.
All processing and rendering happens on the front-end and no data is ever leaves the browser.

You can load resources by loading:
1. Multiple json files, each containing a FHIR resource.
2. A zip file with multiple json files, each containing a FHIR resource.
3. A FHIR Bundle with multiple resources
4. `dataUris` query parameter which points to
   1. A downloadable zip file (following the structure of item 2)
   2. Urls can be | separated to load multiple zip files

## Extending FHIR viewer
Marble FHIR Viewer facilitates rendering FHIR resources in a table format. 
To extend the functionalities and customize how information is displayed, developers can update `DefaultTableColumnConfig.ts` to include new resources and customize how each resource renders.

### Customizing Resources
To customize an existing Resource, add a new object following `TableColumnConfig` interface.
> You can find supported resources on `dataMapping/resources` folder

- `label` defines the column title
- `getValue` defines how the value is accessed for that particular FHIR Resource.
- `renderer` returns a JSX object to render complex values.


```TS
const Medication: Array<TableColumnConfig> = [
  {
    label: "Codes",
    getValue: (r) => getAllCodesAsString(r.code),
    renderer: (r) => buildParagraphList(getAllCodeAsLinks(r.code)),
  },
  {
    label: "Description",
    getValue: (r) => getAllCodesAsString(r.code),
    renderer: (r) => buildParagraphList(getAllDisplay(r.code)),
  },
];
```

### Adding support to new Resources
To add new resources you can start by following steps above and create a new Resource Mapping.
Once created, simply add it to `DefaultTableColumnConfig.ts` on `DefaultTableColumnConfig` object.

### Supporting functions and mappings
Marble FHIR Viewer contains some functions to help you display common FHIR data structures. Those methods are available on `functions/FhirFunctions.tsx`

Additionally, `SystemCodes.ts` and `SystemCodesUrl.ts` contain mappings for common human readable system names and external websites that display further information about external codes.

## Learn more
[Marble APIs](https://www.marbleapi.com/)

[FHIR Resources](http://hl7.org/fhir/R4/resourcelist.html)