export function StatusLabel({
  code,
  children,
}: {
  code: string;
  children: string;
}) {
  return <span className={`desk-status desk-status-${code}`}>{children}</span>;
}
