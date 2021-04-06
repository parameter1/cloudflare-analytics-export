# cloudflare-analytics-export
Exports response code analytics data from Cloudflare to CSV

## Usage

Create a `.env` file at the root of this project:
```
CLOUDFLARE_API_TOKEN=<MY_CLOUDFLARE_TOKEN>
```

Run `yarn` to install dependencies, then run `yarn start` to boot up the app.

Enter the start and end dates and your Cloudflare Zone ID

The data will be written to `out.csv` in the project root, and can be loaded into the [Google Sheets analysis template](https://docs.google.com/spreadsheets/d/1cJKPlyHCW59-P4FfxbHY4T8FwDmgIPp-O6hKMLnr8D8/copy)
