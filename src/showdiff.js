import command from 'commander';

const showDiff = (params) => {
  command
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .parse(params);
};

export default showDiff;
