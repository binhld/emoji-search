import React, { useMemo, useState } from "react";
import "./App.css";
import {
  initialIncidents,
  initialResources,
  provinceCoordinates,
  severityLabels,
  severityWeights,
  weatherAdvisories
} from "./data/rescueData";

const severityPalette = {
  critical: "#b91c1c",
  high: "#ea580c",
  moderate: "#d97706",
  low: "#4d7c0f"
};

const statusPalette = {
  "Chưa xử lý": "#b91c1c",
  "Đang xử lý": "#ea580c",
  "Đã điều phối": "#2563eb",
  "Giám sát": "#4d7c0f",
  "Chờ nguồn lực": "#7c3aed",
  "Đang đánh giá": "#0f766e",
  "Hoàn tất": "#111827"
};

const severityOptions = [
  { value: "all", label: "Tất cả mức độ" },
  { value: "critical", label: "Rất nghiêm trọng" },
  { value: "high", label: "Nghiêm trọng" },
  { value: "moderate", label: "Trung bình" },
  { value: "low", label: "Giám sát" }
];

function formatDateTime(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return `${date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  })}`;
}

function calculateReadiness(availableUnits, totalUnits) {
  if (!totalUnits) {
    return 0;
  }
  const readiness = availableUnits / totalUnits;
  return Math.max(0, Math.min(1, readiness));
}

function App() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [resources, setResources] = useState(initialResources);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedIncidentId, setSelectedIncidentId] = useState(
    initialIncidents[0]?.id ?? null
  );
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activityLog, setActivityLog] = useState(() =>
    initialIncidents.slice(0, 4).map(incident => ({
      id: `${incident.id}-init`,
      timestamp: incident.lastUpdate,
      incidentId: incident.id,
      message: `Cập nhật ban đầu: ${incident.name} (${severityLabels[incident.severity]})`
    }))
  );

  const regionOptions = useMemo(() => {
    const regions = new Set();
    incidents.forEach(incident => regions.add(incident.region));
    return ["all", ...Array.from(regions)];
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      if (selectedRegion !== "all" && incident.region !== selectedRegion) {
        return false;
      }
      if (
        selectedProvince !== "all" &&
        incident.province !== selectedProvince
      ) {
        return false;
      }
      if (
        severityFilter !== "all" &&
        incident.severity !== severityFilter
      ) {
        return false;
      }
      if (searchKeyword) {
        const normalizedSearch = searchKeyword.toLowerCase();
        const text = `${incident.name} ${incident.province} ${incident.description}`.toLowerCase();
        if (!text.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [incidents, searchKeyword, selectedProvince, selectedRegion, severityFilter]);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }
    return (
      incidents.find(incident => incident.id === selectedIncidentId) ||
      filteredIncidents[0] ||
      null
    );
  }, [filteredIncidents, incidents, selectedIncidentId]);

  const heatmapPoints = useMemo(() => {
    const aggregated = incidents.reduce((accumulator, incident) => {
      const { province, severity } = incident;
      const coordinates = provinceCoordinates[province];
      if (!coordinates) {
        return accumulator;
      }
      if (!accumulator[province]) {
        accumulator[province] = {
          province,
          region: incident.region,
          incidentCount: 0,
          totalWeight: 0,
          critical: 0,
          coordinates
        };
      }
      const provinceData = accumulator[province];
      provinceData.incidentCount += 1;
      provinceData.totalWeight += severityWeights[severity] ?? 1;
      if (severity === "critical") {
        provinceData.critical += 1;
      }
      return accumulator;
    }, {});

    const maxWeight = Object.values(aggregated).reduce(
      (max, province) => Math.max(max, province.totalWeight),
      1
    );

    return Object.values(aggregated).map(province => {
      const intensity = Math.min(1, province.totalWeight / maxWeight);
      return {
        ...province,
        intensity,
        averageWeight: province.totalWeight / province.incidentCount
      };
    });
  }, [incidents]);

  const incidentSummary = useMemo(() => {
    const totals = incidents.reduce(
      (result, incident) => {
        const severity = incident.severity;
        result.total += 1;
        if (severity === "critical") {
          result.critical += 1;
        }
        if (incident.status === "Chưa xử lý" || incident.status === "Chờ nguồn lực") {
          result.pending += 1;
        }
        if (incident.status === "Đã điều phối" || incident.status === "Đang xử lý") {
          result.dispatched += 1;
        }
        result.peopleAffected += incident.peopleAffected;
        return result;
      },
      { total: 0, critical: 0, pending: 0, dispatched: 0, peopleAffected: 0 }
    );

    const regionalStats = incidents.reduce((result, incident) => {
      if (!result[incident.region]) {
        result[incident.region] = {
          total: 0,
          critical: 0,
          peopleAffected: 0
        };
      }
      const region = result[incident.region];
      region.total += 1;
      region.peopleAffected += incident.peopleAffected;
      if (incident.severity === "critical") {
        region.critical += 1;
      }
      return result;
    }, {});

    return { totals, regionalStats };
  }, [incidents]);

  const resourceSummary = useMemo(() => {
    const totals = resources.reduce(
      (result, resource) => {
        result.availableUnits += resource.availableUnits;
        result.totalUnits += resource.totalUnits;
        result.averageReadiness += calculateReadiness(
          resource.availableUnits,
          resource.totalUnits
        );
        if (resource.supportingIncidents.some(incidentId => {
          const incident = incidents.find(item => item.id === incidentId);
          return incident && incident.region !== resource.region;
        })) {
          result.crossRegionSupports += 1;
        }
        if (resource.availableUnits === 0) {
          result.fullyDeployed += 1;
        }
        return result;
      },
      {
        availableUnits: 0,
        totalUnits: 0,
        averageReadiness: 0,
        fullyDeployed: 0,
        crossRegionSupports: 0
      }
    );

    const resourceCount = resources.length || 1;

    return {
      ...totals,
      averageReadiness: totals.averageReadiness / resourceCount,
      deployedUnits: totals.totalUnits - totals.availableUnits
    };
  }, [incidents, resources]);

  const handleResetFilters = () => {
    setSelectedRegion("all");
    setSelectedProvince("all");
    setSeverityFilter("all");
    setSearchKeyword("");
  };

  const handleSelectProvince = province => {
    setSelectedProvince(province);
    const provinceIncident = incidents.find(
      incident => incident.province === province
    );
    if (provinceIncident) {
      setSelectedRegion(provinceIncident.region);
      setSelectedIncidentId(provinceIncident.id);
    }
  };

  const appendLog = (incidentId, message) => {
    const logEntry = {
      id: `${incidentId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      incidentId,
      message
    };
    setActivityLog(previous => [logEntry, ...previous].slice(0, 16));
  };

  const handleDispatch = incidentId => {
    const incident = incidents.find(item => item.id === incidentId);
    if (!incident) {
      return;
    }

    let selectedResourceIndex = -1;
    let selectedResource = null;

    resources.forEach((resource, index) => {
      if (resource.availableUnits <= 0) {
        return;
      }
      const inSameRegion = resource.region === incident.region;
      if (!selectedResource) {
        selectedResource = resource;
        selectedResourceIndex = index;
        return;
      }
      const currentScore = (selectedResource.region === incident.region ? 2 : 1) *
        (selectedResource.availableUnits + 1);
      const candidateScore = (inSameRegion ? 2 : 1) * (resource.availableUnits + 1);
      if (candidateScore > currentScore) {
        selectedResource = resource;
        selectedResourceIndex = index;
      }
    });

    if (!selectedResource) {
      appendLog(
        incident.id,
        `Không đủ nguồn lực để điều phối cho ${incident.name}. Đánh dấu chờ bổ sung.`
      );
      setIncidents(previous =>
        previous.map(item =>
          item.id === incident.id
            ? {
                ...item,
                status: "Chờ nguồn lực",
                lastUpdate: new Date().toISOString()
              }
            : item
        )
      );
      return;
    }

    setResources(previous => {
      const updated = [...previous];
      const resource = { ...selectedResource };
      const updatedAvailableUnits = Math.max(0, resource.availableUnits - 1);
      const updatedSupporting = resource.supportingIncidents.includes(incident.id)
        ? resource.supportingIncidents
        : [...resource.supportingIncidents, incident.id];
      const newStatus = updatedAvailableUnits === 0 ? "Đang triển khai" : "Sẵn sàng";
      const updatedResource = {
        ...resource,
        availableUnits: updatedAvailableUnits,
        supportingIncidents: updatedSupporting,
        status: newStatus,
        readiness: calculateReadiness(updatedAvailableUnits, resource.totalUnits),
        lastDeployment: new Date().toISOString()
      };
      updated[selectedResourceIndex] = updatedResource;
      return updated;
    });

    setIncidents(previous =>
      previous.map(item =>
        item.id === incident.id
          ? {
              ...item,
              status: "Đang xử lý",
              lastUpdate: new Date().toISOString()
            }
          : item
      )
    );

    appendLog(
      incident.id,
      `Điều phối lực lượng ${selectedResource.name} (${selectedResource.base}) tới ${incident.province}.`
    );
    setSelectedIncidentId(incident.id);
  };

  const handleResolve = incidentId => {
    const incident = incidents.find(item => item.id === incidentId);
    if (!incident) {
      return;
    }

    setIncidents(previous =>
      previous.map(item =>
        item.id === incident.id
          ? {
              ...item,
              status: "Hoàn tất",
              severity: item.severity === "critical" ? "high" : item.severity,
              lastUpdate: new Date().toISOString()
            }
          : item
      )
    );

    setResources(previous =>
      previous.map(resource => {
        if (!resource.supportingIncidents.includes(incident.id)) {
          return resource;
        }
        const filtered = resource.supportingIncidents.filter(
          id => id !== incident.id
        );
        const restoredUnits = Math.min(
          resource.totalUnits,
          resource.availableUnits + 1
        );
        const isStillSupporting = filtered.length > 0;
        return {
          ...resource,
          availableUnits: restoredUnits,
          supportingIncidents: filtered,
          status: isStillSupporting ? "Đang triển khai" : "Sẵn sàng",
          readiness: calculateReadiness(restoredUnits, resource.totalUnits)
        };
      })
    );

    appendLog(
      incident.id,
      `Hoàn tất xử lý sự cố ${incident.name}. Giải phóng nguồn lực liên quan.`
    );
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div>
          <h1>Hệ thống Bản đồ nhiệt & Điều phối cứu hộ quốc gia</h1>
          <p>
            Giám sát theo thời gian thực các sự cố thiên tai, điều phối lực lượng cứu hộ
            đa vùng và theo dõi mức độ sẵn sàng của nguồn lực chiến lược.
          </p>
        </div>
        <div className="header-controls">
          <div className="control-group">
            <label htmlFor="region-filter">Vùng</label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={event => {
                setSelectedRegion(event.target.value);
                setSelectedProvince("all");
              }}
            >
              {regionOptions.map(option => (
                <option key={option} value={option}>
                  {option === "all" ? "Toàn quốc" : option}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="province-filter">Tỉnh/Thành</label>
            <select
              id="province-filter"
              value={selectedProvince}
              onChange={event => setSelectedProvince(event.target.value)}
            >
              <option value="all">Tất cả</option>
              {incidents
                .filter(incident =>
                  selectedRegion === "all"
                    ? true
                    : incident.region === selectedRegion
                )
                .map(incident => incident.province)
                .filter((province, index, array) => array.indexOf(province) === index)
                .map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="severity-filter">Mức độ</label>
            <select
              id="severity-filter"
              value={severityFilter}
              onChange={event => setSeverityFilter(event.target.value)}
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group search">
            <label htmlFor="search-keyword">Tìm kiếm</label>
            <input
              id="search-keyword"
              type="search"
              placeholder="Tên sự cố, địa điểm, hạ tầng"
              value={searchKeyword}
              onChange={event => setSearchKeyword(event.target.value)}
            />
          </div>
          <button className="reset-button" type="button" onClick={handleResetFilters}>
            Xóa lọc
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="heatmap-card">
          <header>
            <h2>Bản đồ nhiệt theo tỉnh/thành</h2>
            <span className="heatmap-description">
              Nhấp vào điểm nóng để xem chi tiết sự cố tại địa phương
            </span>
          </header>
          <div className="heatmap-wrapper">
            <div className="heatmap-silhouette">
              {heatmapPoints.map(point => (
                <button
                  key={point.province}
                  type="button"
                  className={`heatmap-point${
                    selectedProvince === point.province ? " active" : ""
                  }`}
                  style={{
                    top: `${point.coordinates.top}%`,
                    left: `${point.coordinates.left}%`,
                    background:
                      point.intensity >= 0.75
                        ? "rgba(185, 28, 28, 0.85)"
                        : point.intensity >= 0.5
                        ? "rgba(234, 88, 12, 0.75)"
                        : point.intensity >= 0.25
                        ? "rgba(217, 119, 6, 0.65)"
                        : "rgba(74, 222, 128, 0.55)",
                    boxShadow: `0 0 ${10 + point.intensity * 20}px rgba(185, 28, 28, ${
                      0.2 + point.intensity * 0.4
                    })`
                  }}
                  onClick={() => handleSelectProvince(point.province)}
                >
                  <span className="heatmap-point__province">{point.province}</span>
                  <span className="heatmap-point__count">{point.incidentCount}</span>
                </button>
              ))}
              <div className="heatmap-legend">
                <div>
                  <span className="legend-color critical" />
                  <span>Nguy cơ rất cao</span>
                </div>
                <div>
                  <span className="legend-color high" />
                  <span>Nguy cơ cao</span>
                </div>
                <div>
                  <span className="legend-color moderate" />
                  <span>Nguy cơ trung bình</span>
                </div>
                <div>
                  <span className="legend-color low" />
                  <span>Theo dõi</span>
                </div>
              </div>
            </div>
          </div>
          <footer className="heatmap-footer">
            <div>
              <strong>Tổng điểm nóng:</strong> {heatmapPoints.length}
            </div>
            <div>
              <strong>Tỉnh chọn:</strong> {selectedProvince === "all" ? "Toàn quốc" : selectedProvince}
            </div>
          </footer>
        </section>

        <section className="summary-card">
          <header>
            <h2>Tổng quan hoạt động cứu hộ</h2>
          </header>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Tổng số sự cố</span>
              <strong className="summary-value">{incidentSummary.totals.total}</strong>
              <span className="summary-sub">{incidentSummary.totals.critical} sự cố rất nghiêm trọng</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Đang điều phối</span>
              <strong className="summary-value">{incidentSummary.totals.dispatched}</strong>
              <span className="summary-sub">{incidentSummary.totals.pending} đang chờ xử lý</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lực lượng sẵn sàng</span>
              <strong className="summary-value">{resourceSummary.availableUnits}</strong>
              <span className="summary-sub">{resourceSummary.deployedUnits} đơn vị đang triển khai</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Người bị ảnh hưởng</span>
              <strong className="summary-value">{incidentSummary.totals.peopleAffected}</strong>
              <span className="summary-sub">{resourceSummary.crossRegionSupports} đơn vị hỗ trợ liên vùng</span>
            </div>
          </div>
          <div className="regional-breakdown">
            <h3>Phân bổ theo vùng</h3>
            <ul>
              {Object.entries(incidentSummary.regionalStats).map(([region, stats]) => (
                <li key={region}>
                  <span>{region}</span>
                  <span>
                    {stats.total} sự cố ({stats.critical} nghiêm trọng) · {stats.peopleAffected} người ảnh hưởng
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="incident-card">
          <header>
            <div>
              <h2>Danh sách sự cố</h2>
              <span className="card-subtitle">
                Ưu tiên hiển thị theo mức độ nghiêm trọng và thời gian cập nhật
              </span>
            </div>
          </header>
          <div className="incident-table">
            <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Sự cố</th>
                  <th>Vùng</th>
                  <th>Mức độ</th>
                  <th>Trạng thái</th>
                  <th>Người ảnh hưởng</th>
                  <th>Cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents
                  .sort((a, b) => {
                    const weightDiff =
                      (severityWeights[b.severity] ?? 1) -
                      (severityWeights[a.severity] ?? 1);
                    if (weightDiff !== 0) {
                      return weightDiff;
                    }
                    return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
                  })
                  .map(incident => {
                    const isSelected = selectedIncident?.id === incident.id;
                    return (
                      <tr
                        key={incident.id}
                        className={isSelected ? "selected" : undefined}
                        onClick={() => setSelectedIncidentId(incident.id)}
                      >
                        <td>{incident.id}</td>
                        <td>
                          <div className="incident-name">{incident.name}</div>
                          <div className="incident-location">{incident.province} · {incident.district}</div>
                        </td>
                        <td>{incident.region}</td>
                        <td>
                          <span
                            className="severity-badge"
                            style={{
                              backgroundColor: severityPalette[incident.severity] || "#1f2937"
                            }}
                          >
                            {severityLabels[incident.severity] || incident.severity}
                          </span>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: statusPalette[incident.status] || "#4b5563"
                            }}
                          >
                            {incident.status}
                          </span>
                        </td>
                        <td>{incident.peopleAffected.toLocaleString("vi-VN")}</td>
                        <td>{formatDateTime(incident.lastUpdate)}</td>
                        <td>
                          <div className="incident-actions">
                            <button
                              type="button"
                              className="dispatch"
                              onClick={event => {
                                event.stopPropagation();
                                handleDispatch(incident.id);
                              }}
                            >
                              Điều phối
                            </button>
                            <button
                              type="button"
                              className="resolve"
                              onClick={event => {
                                event.stopPropagation();
                                handleResolve(incident.id);
                              }}
                            >
                              Hoàn tất
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {filteredIncidents.length === 0 && (
              <div className="empty-state">
                Không tìm thấy sự cố phù hợp với điều kiện lọc hiện tại.
              </div>
            )}
          </div>
        </section>

        <section className="detail-card">
          <header>
            <h2>Chi tiết điều phối</h2>
            <span className="card-subtitle">Thông tin hoạt động của sự cố được chọn</span>
          </header>
          {selectedIncident ? (
            <div className="incident-detail">
              <div className="detail-header">
                <div>
                  <span className="detail-id">{selectedIncident.id}</span>
                  <h3>{selectedIncident.name}</h3>
                </div>
                <div className="detail-severity">
                  <span
                    className="severity-badge"
                    style={{
                      backgroundColor: severityPalette[selectedIncident.severity] || "#1f2937"
                    }}
                  >
                    {severityLabels[selectedIncident.severity] || selectedIncident.severity}
                  </span>
                </div>
              </div>
              <p className="incident-description">{selectedIncident.description}</p>
              <div className="detail-grid">
                <div>
                  <h4>Địa điểm & quy mô</h4>
                  <ul>
                    <li>
                      <strong>Vùng:</strong> {selectedIncident.region}
                    </li>
                    <li>
                      <strong>Tỉnh/Thành:</strong> {selectedIncident.province}
                    </li>
                    <li>
                      <strong>Huyện/TP:</strong> {selectedIncident.district}
                    </li>
                    <li>
                      <strong>Người bị ảnh hưởng:</strong> {selectedIncident.peopleAffected.toLocaleString("vi-VN")}
                    </li>
                    <li>
                      <strong>Số hộ di dời:</strong> {selectedIncident.householdsEvacuated}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4>Nhu cầu & hạ tầng</h4>
                  <ul>
                    <li>
                      <strong>Nguồn lực:</strong> {selectedIncident.resourcesRequired.join(", ")}
                    </li>
                    <li>
                      <strong>Hạ tầng ảnh hưởng:</strong> {selectedIncident.infrastructure.join(", ")}
                    </li>
                    <li>
                      <strong>Trạng thái:</strong> {selectedIncident.status}
                    </li>
                    <li>
                      <strong>Giờ báo cáo:</strong> {formatDateTime(selectedIncident.reportTime)}
                    </li>
                    <li>
                      <strong>Cập nhật gần nhất:</strong> {formatDateTime(selectedIncident.lastUpdate)}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">Chọn một sự cố để xem chi tiết điều phối.</div>
          )}
        </section>

        <section className="resource-card">
          <header>
            <h2>Năng lực lực lượng cứu hộ</h2>
            <span className="card-subtitle">
              Theo dõi mức độ sẵn sàng và phạm vi hỗ trợ của từng đơn vị
            </span>
          </header>
          <div className="resource-list">
            {resources.map(resource => {
              const readinessPercent = Math.round(
                calculateReadiness(resource.availableUnits, resource.totalUnits) * 100
              );
              return (
                <article key={resource.id} className="resource-item">
                  <div className="resource-header">
                    <div>
                      <h3>{resource.name}</h3>
                      <span className="resource-type">{resource.type} · {resource.region}</span>
                    </div>
                    <div className="resource-metrics">
                      <span className="metric">
                        {resource.availableUnits}/{resource.totalUnits} đội
                      </span>
                      <span className="metric">
                        {readinessPercent}% sẵn sàng
                      </span>
                    </div>
                  </div>
                  <div className="resource-body">
                    <div>
                      <strong>Chuyên môn:</strong> {resource.specialties.join(", ")}
                    </div>
                    <div>
                      <strong>Thiết bị chủ lực:</strong> {resource.equipment.join(", ")}
                    </div>
                    <div>
                      <strong>Đang hỗ trợ:</strong> {resource.supportingIncidents.length || "Không"}
                    </div>
                    <div>
                      <strong>Liên hệ:</strong> {resource.contact}
                    </div>
                  </div>
                  <div className="readiness-bar">
                    <div
                      className="readiness-bar__fill"
                      style={{ width: `${readinessPercent}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="advisory-card">
          <header>
            <h2>Khuyến nghị khí tượng thủy văn</h2>
            <span className="card-subtitle">Nguồn: Trung tâm dự báo quốc gia</span>
          </header>
          <ul className="advisory-list">
            {weatherAdvisories.map(advisory => (
              <li key={advisory.region}>
                <div className="advisory-header">
                  <h3>{advisory.region}</h3>
                  <span className="risk-level">{advisory.riskLevel}</span>
                </div>
                <p>{advisory.summary}</p>
                <ul className="advisory-recommendations">
                  {advisory.recommendations.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="activity-card">
          <header>
            <h2>Nhật ký điều phối</h2>
            <span className="card-subtitle">Các hoạt động gần nhất trên toàn quốc</span>
          </header>
          <ul className="activity-list">
            {activityLog.map(entry => (
              <li key={entry.id}>
                <div>
                  <span className="activity-time">{formatDateTime(entry.timestamp)}</span>
                  <strong>{entry.incidentId}</strong> · {entry.message}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
